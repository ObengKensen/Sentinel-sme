import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PROFILE = path.join(os.tmpdir(), "sentinel-cdp-profile2");
const PORT = 9334;

fs.rmSync(PROFILE, { recursive: true, force: true });
fs.mkdirSync(PROFILE, { recursive: true });

const edge = spawn(
  EDGE,
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "about:blank",
  ],
  { stdio: "ignore" },
);

function cdp(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    const events = [];
    ws.addEventListener("open", () => resolve({ ws, send, events, close: () => ws.close() }));
    ws.addEventListener("error", reject);
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve: r, reject: j } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) j(new Error(JSON.stringify(msg.error)));
        else r(msg.result);
      } else if (msg.method) events.push(msg);
    });
    function send(method, params = {}) {
      const mid = ++id;
      return new Promise((r, j) => {
        pending.set(mid, { resolve: r, reject: j });
        ws.send(JSON.stringify({ id: mid, method, params }));
      });
    }
  });
}

async function waitReady() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error("CDP not ready");
}

async function open(url) {
  const created = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT",
  }).then((r) => r.json());
  const session = await cdp(created.webSocketDebuggerUrl);
  await session.send("Runtime.enable");
  await session.send("Console.enable");
  await session.send("Page.enable");
  return session;
}

async function evalPage(session, expression) {
  const r = await session.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return r.result.value;
}

try {
  await waitReady();
  const session = await open("http://localhost:8080/register");
  await sleep(3000);

  // Register a fresh user via the UI if form is present
  const formState = await evalPage(
    session,
    `({
      title: document.title,
      text: document.body.innerText.slice(0, 400),
      hasError: /didn't load|failed to load/i.test(document.body.innerText),
      hasRegister: /Create|Register|Get started|Sign up/i.test(document.body.innerText)
    })`,
  );
  console.log("REGISTER PAGE:", JSON.stringify(formState, null, 2));

  // Seed auth + navigate to dashboard like after login
  const email = `diag_${Date.now()}@test.local`;
  const result = await evalPage(
    session,
    `
    (async () => {
      // Use localStorage + API path is hard; trigger register through page if inputs exist
      const inputs = [...document.querySelectorAll('input')].map(i => ({id:i.id, type:i.type, name:i.name}));
      return { inputs, href: location.href };
    })()
  `,
  );
  console.log("inputs:", JSON.stringify(result, null, 2));

  // Navigate to dashboard unauthenticated — should redirect, not crash
  await session.send("Page.navigate", { url: "http://localhost:8080/app/dashboard" });
  await sleep(4000);
  const dash = await evalPage(
    session,
    `({
      href: location.href,
      title: document.title,
      text: document.body.innerText.slice(0, 500),
      hasError: /didn't load|failed to load/i.test(document.body.innerText)
    })`,
  );
  console.log("DASHBOARD NAV:", JSON.stringify(dash, null, 2));

  const exceptions = session.events
    .filter((e) => e.method === "Runtime.exceptionThrown")
    .map((e) => e.params.exceptionDetails?.exception?.description || e.params.exceptionDetails?.text);
  console.log("exceptions:", exceptions.length ? exceptions : "none");
  session.close();
} finally {
  edge.kill();
}

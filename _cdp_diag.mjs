import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PROFILE = path.join(os.tmpdir(), "sentinel-cdp-profile");
const PORT = 9333;

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
    ws.addEventListener("open", () => resolve({ ws, send, events }));
    ws.addEventListener("error", reject);
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve: r, reject: j } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) j(new Error(JSON.stringify(msg.error)));
        else r(msg.result);
      } else if (msg.method) {
        events.push(msg);
      }
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
      if (res.ok) return res.json();
    } catch {}
    await sleep(250);
  }
  throw new Error("CDP not ready");
}

try {
  await waitReady();
  for (const url of ["http://localhost:8080/", "http://localhost:8080/login"]) {
    const created = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, {
      method: "PUT",
    }).then((r) => r.json());
    const session = await cdp(created.webSocketDebuggerUrl);
    await session.send("Runtime.enable");
    await session.send("Console.enable");
    await session.send("Page.enable");
    await session.send("Network.enable");
    await sleep(4500);
    const evalResult = await session.send("Runtime.evaluate", {
      expression: `({
        title: document.title,
        text: document.body ? document.body.innerText.slice(0, 500) : '',
        hasError: /didn't load|failed to load/i.test(document.body?.innerText || ''),
        hasContent: /Risk Sentinel|Welcome back|Detect business/i.test(document.body?.innerText || '')
      })`,
      returnByValue: true,
    });
    const consoleMsgs = session.events
      .filter((e) => e.method === "Runtime.exceptionThrown" || e.method === "Console.messageAdded")
      .map((e) => {
        if (e.method === "Runtime.exceptionThrown") {
          return { type: "exception", text: e.params.exceptionDetails?.exception?.description || e.params.exceptionDetails?.text };
        }
        return { type: e.params.message?.level, text: e.params.message?.text };
      });
    console.log("\n===", url);
    console.log(JSON.stringify(evalResult.result.value, null, 2));
    console.log("console:", consoleMsgs.length ? JSON.stringify(consoleMsgs, null, 2) : "none");
    session.ws.close();
  }
} finally {
  edge.kill();
}

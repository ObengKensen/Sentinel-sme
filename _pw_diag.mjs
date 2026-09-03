import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import net from "node:net";
import http from "node:http";

function waitPort(port, ms = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tryConnect = () => {
      const s = net.connect(port, "127.0.0.1", () => {
        s.end();
        resolve();
      });
      s.on("error", () => {
        if (Date.now() - start > ms) reject(new Error("port timeout"));
        else setTimeout(tryConnect, 200);
      });
    };
    tryConnect();
  });
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, data }));
    }).on("error", reject);
  });
}

// Install playwright chromium lightly via npx playwright without adding to package.json permanently
const r = spawnSync(
  "npm",
  ["install", "playwright-core@1.52.0", "--no-save", "--prefix", process.env.TEMP + "\\pw-core-tmp"],
  { stdio: "inherit", shell: true },
);
if (r.status !== 0) process.exit(1);

// Ensure browser exists
spawnSync("npx", ["--yes", "playwright@1.52.0", "install", "chromium"], {
  stdio: "inherit",
  shell: true,
});

const { chromium } = await import(
  `file:///${(process.env.TEMP + "\\pw-core-tmp\\node_modules\\playwright-core\\index.js").replace(/\\/g, "/")}`
);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const logs = [];
page.on("console", (msg) => logs.push({ type: msg.type(), text: msg.text() }));
page.on("pageerror", (err) => logs.push({ type: "pageerror", text: String(err?.stack || err) }));

for (const url of ["http://localhost:8080/", "http://localhost:8080/login"]) {
  logs.length = 0;
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2500);
  const text = await page.innerText("body");
  console.log("\n===", url);
  console.log("title:", await page.title());
  console.log("error UI:", /didn't load|failed to load/i.test(text));
  console.log("has expected content:", /Risk Sentinel|Welcome back|Detect business/i.test(text));
  const bad = logs.filter((l) => l.type === "error" || l.type === "pageerror");
  console.log("errors:", bad.length ? JSON.stringify(bad, null, 2) : "none");
}

await browser.close();

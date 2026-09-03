/**
 * Use Playwright to capture client-side console errors after hydration.
 * Installs playwright only if missing.
 */
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);

async function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    console.log("Installing playwright chromium (one-time)...");
    const r = spawnSync("npm", ["install", "-D", "playwright@1.52.0", "--no-save"], {
      stdio: "inherit",
      shell: true,
      cwd: process.cwd(),
    });
    if (r.status !== 0) throw new Error("playwright install failed");
    spawnSync("npx", ["playwright", "install", "chromium"], {
      stdio: "inherit",
      shell: true,
      cwd: process.cwd(),
    });
    return require("playwright");
  }
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const logs = [];
page.on("console", (msg) => logs.push({ type: msg.type(), text: msg.text() }));
page.on("pageerror", (err) => logs.push({ type: "pageerror", text: String(err) }));

for (const url of ["http://localhost:8080/", "http://localhost:8080/login"]) {
  logs.length = 0;
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);
  const bodyText = await page.locator("body").innerText();
  const title = await page.title();
  console.log("\n===", url);
  console.log("title:", title);
  console.log("error UI:", bodyText.includes("didn't load") || bodyText.toLowerCase().includes("failed to load"));
  console.log("snippet:", bodyText.slice(0, 200).replace(/\s+/g, " "));
  const errs = logs.filter((l) => l.type === "error" || l.type === "pageerror");
  console.log("console errors:", errs.length ? JSON.stringify(errs, null, 2) : "none");
}

await browser.close();

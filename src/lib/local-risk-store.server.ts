import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import type { PersistedRiskState } from "./api/risk-data.functions";

type FileRiskStore = Record<string, PersistedRiskState>;

let storePathOverride: string | null = null;
let writeChain: Promise<void> = Promise.resolve();

export function setFileRiskStorePath(nextPath: string | null) {
  storePathOverride = nextPath;
}

export function getFileRiskStorePath() {
  if (storePathOverride) return storePathOverride;
  if (process.env.RISK_STORE_PATH?.trim()) return process.env.RISK_STORE_PATH.trim();
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "sme-risk-states.json");
  }
  return path.join(process.cwd(), ".data", "risk-states.json");
}

async function readStore(): Promise<FileRiskStore> {
  try {
    const raw = await readFile(getFileRiskStorePath(), "utf8");
    const parsed = JSON.parse(raw) as FileRiskStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeStore(store: FileRiskStore) {
  const filePath = getFileRiskStorePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tempPath, JSON.stringify(store), "utf8");
  await rename(tempPath, filePath);
}

function enqueueWrite<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function fileLoadRiskState(userId: string): Promise<PersistedRiskState | null> {
  const store = await readStore();
  return store[userId] ?? null;
}

export async function fileLoadAllRiskStates(): Promise<Record<string, PersistedRiskState>> {
  return readStore();
}

export async function fileSaveRiskState(
  userId: string,
  state: PersistedRiskState,
): Promise<PersistedRiskState> {
  return enqueueWrite(async () => {
    const store = await readStore();
    store[userId] = state;
    await writeStore(store);
    return state;
  });
}

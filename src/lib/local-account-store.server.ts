import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { randomUUID } from "node:crypto";

import type { UserRole } from "./auth/jwt.shared";

export type FileUserStatus = "active" | "suspended";

export type FileUserProfile = {
  businessName: string;
  ownerName: string;
  phone: string;
  businessType: string;
  employees: number;
};

export type FileUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: FileUserStatus;
  createdAt: string;
  updatedAt: string;
  profile: FileUserProfile | null;
};

type FileStore = {
  users: FileUser[];
};

const DEFAULT_STORE = (): FileStore => ({ users: [] });

let storePathOverride: string | null = null;
let writeChain: Promise<void> = Promise.resolve();

export function setFileAccountStorePath(nextPath: string | null) {
  storePathOverride = nextPath;
}

export function getFileAccountStorePath() {
  if (storePathOverride) return storePathOverride;
  if (process.env.ACCOUNT_STORE_PATH?.trim()) return process.env.ACCOUNT_STORE_PATH.trim();
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "sme-risk-accounts.json");
  }
  return path.join(process.cwd(), ".data", "accounts.json");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function readStore(): Promise<FileStore> {
  const filePath = getFileAccountStorePath();
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as FileStore;
    if (!parsed || !Array.isArray(parsed.users)) return DEFAULT_STORE();
    return parsed;
  } catch {
    return DEFAULT_STORE();
  }
}

async function writeStore(store: FileStore) {
  const filePath = getFileAccountStorePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tempPath, JSON.stringify(store, null, 2), "utf8");
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

export async function ensureFileAccountStore(): Promise<void> {
  const store = await readStore();
  await enqueueWrite(async () => {
    await writeStore(store);
  });
}

export async function fileFindUserByEmail(email: string): Promise<FileUser | undefined> {
  const store = await readStore();
  const normalized = normalizeEmail(email);
  return store.users.find((user) => user.email === normalized);
}

export async function fileFindUserById(id: string): Promise<FileUser | undefined> {
  const store = await readStore();
  return store.users.find((user) => user.id === id);
}

export async function fileListUsers(): Promise<FileUser[]> {
  const store = await readStore();
  return [...store.users].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function fileCreateUser(input: {
  email: string;
  passwordHash: string;
  role: UserRole;
  status?: FileUserStatus;
  profile?: FileUserProfile | null;
}): Promise<FileUser> {
  return enqueueWrite(async () => {
    const store = await readStore();
    const email = normalizeEmail(input.email);
    if (store.users.some((user) => user.email === email)) {
      throw new Error("EMAIL_EXISTS");
    }
    const now = new Date().toISOString();
    const user: FileUser = {
      id: randomUUID(),
      email,
      passwordHash: input.passwordHash,
      role: input.role,
      status: input.status ?? "active",
      createdAt: now,
      updatedAt: now,
      profile: input.profile ?? null,
    };
    store.users.push(user);
    await writeStore(store);
    return user;
  });
}

export async function fileUpdateUser(
  id: string,
  patch: Partial<Pick<FileUser, "email" | "passwordHash" | "status" | "profile">>,
): Promise<FileUser | undefined> {
  return enqueueWrite(async () => {
    const store = await readStore();
    const index = store.users.findIndex((user) => user.id === id);
    if (index < 0) return undefined;
    if (patch.email) {
      const email = normalizeEmail(patch.email);
      if (store.users.some((user) => user.email === email && user.id !== id)) {
        throw new Error("EMAIL_EXISTS");
      }
      patch = { ...patch, email };
    }
    const next: FileUser = {
      ...store.users[index]!,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    store.users[index] = next;
    await writeStore(store);
    return next;
  });
}

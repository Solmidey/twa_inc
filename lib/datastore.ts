import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'purchases.json');

type PurchaseRecord = {
  sessionId: string;
  email?: string | null;
  planId?: string;
  paid: boolean;
  token?: string;
  tokenExpiresAt?: number;
};

type Store = Record<string, PurchaseRecord>;

const ensureFile = () => {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, '{}', 'utf8');
  }
};

const readStore = (): Store => {
  ensureFile();
  const raw = fs.readFileSync(dataPath, 'utf8');
  try {
    return JSON.parse(raw || '{}');
  } catch (e) {
    console.error('Failed to parse purchases.json; resetting file', e);
    fs.writeFileSync(dataPath, '{}', 'utf8');
    return {};
  }
};

const writeStore = (store: Store) => {
  fs.writeFileSync(dataPath, JSON.stringify(store, null, 2));
};

export const upsertPurchase = (record: PurchaseRecord) => {
  const store = readStore();
  store[record.sessionId] = { ...store[record.sessionId], ...record };
  writeStore(store);
};

export const markPaid = (sessionId: string, email?: string | null) => {
  const store = readStore();
  const existing = store[sessionId];
  if (!existing) return;
  store[sessionId] = { ...existing, paid: true, email: email ?? existing.email };
  writeStore(store);
};

export const getPurchase = (sessionId: string) => {
  const store = readStore();
  return store[sessionId];
};

export const storeToken = (sessionId: string, token: string, expiresAt: number) => {
  const store = readStore();
  const record = store[sessionId];
  if (!record) return;
  store[sessionId] = { ...record, token, tokenExpiresAt: expiresAt };
  writeStore(store);
};

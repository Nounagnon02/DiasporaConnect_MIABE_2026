import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '../../diaspora.db'));

// ── Schéma ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS transfers (
    transfer_id       TEXT PRIMARY KEY,
    sender_address    TEXT NOT NULL,
    recipient_phone   TEXT NOT NULL,
    operator          TEXT NOT NULL,
    amount_cusd       TEXT NOT NULL,
    amount_fcfa       INTEGER,
    status            TEXT NOT NULL DEFAULT 'locked',
    -- locked | converting | converted | sending | completed | refunded | failed
    tx_hash           TEXT,
    yc_conversion_id  TEXT,
    cp_transfer_id    TEXT,
    error_message     TEXT,
    retry_count       INTEGER DEFAULT 0,
    created_at        INTEGER NOT NULL,
    updated_at        INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS conversion_log (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    transfer_id       TEXT NOT NULL,
    provider          TEXT NOT NULL,
    event             TEXT NOT NULL,
    payload           TEXT,
    created_at        INTEGER NOT NULL
  );
`);

// ── Helpers ───────────────────────────────────────────────────────────────────

const now = () => Date.now();

export const createTransfer = (data) => {
  const ts = now();
  db.prepare(`
    INSERT INTO transfers
      (transfer_id, sender_address, recipient_phone, operator, amount_cusd, status, tx_hash, created_at, updated_at)
    VALUES
      (@transfer_id, @sender_address, @recipient_phone, @operator, @amount_cusd, 'locked', @tx_hash, @ts, @ts)
  `).run({ ...data, ts });
};

export const getTransfer = (transferId) =>
  db.prepare('SELECT * FROM transfers WHERE transfer_id = ?').get(transferId);

export const updateTransfer = (transferId, fields) => {
  const sets = Object.keys(fields).map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE transfers SET ${sets}, updated_at = @updated_at WHERE transfer_id = @transfer_id`)
    .run({ ...fields, transfer_id: transferId, updated_at: now() });
};

export const logEvent = (transferId, provider, event, payload = null) => {
  db.prepare(`
    INSERT INTO conversion_log (transfer_id, provider, event, payload, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(transferId, provider, event, payload ? JSON.stringify(payload) : null, now());
};

export const getAllTransfers = () =>
  db.prepare('SELECT * FROM transfers ORDER BY created_at DESC').all();

export default db;

import { DatabaseSync } from 'node:sqlite';
import { validateMonitorUrl } from '../../../packages/url-policy/src/index.js';
export interface Monitor { id: number; name: string; url: string }
export class SentinelStore {
  private readonly db: DatabaseSync;
  constructor(path: string) {
    this.db = new DatabaseSync(path);
    this.db.exec(`CREATE TABLE IF NOT EXISTS monitors (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 80),
      url TEXT NOT NULL UNIQUE
    ) STRICT`);
  }
  add(name: string, input: string): Monitor {
    const cleanName = name.trim();
    if (!cleanName || cleanName.length > 80) throw new Error('Name must have 1–80 characters');
    const url = validateMonitorUrl(input);
    const result = this.db.prepare('INSERT INTO monitors(name,url) VALUES (?,?)').run(cleanName,url);
    return { id: Number(result.lastInsertRowid), name: cleanName, url };
  }
  list(): Monitor[] {
    return this.db.prepare('SELECT id,name,url FROM monitors ORDER BY id').all() as unknown as Monitor[];
  }
  close(): void { this.db.close(); }
}

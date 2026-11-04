import { realpathSync, readFileSync } from 'node:fs';
import { resolve, relative, isAbsolute, sep } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { validateMonitorUrl } from '../../url-policy/src/index.js';
export interface MonitorSpec { name: string; url: string; intervalSeconds: number }
export function parseMonitorSpec(input: unknown): MonitorSpec {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) throw new Error('Expected object');
  const value = input as Record<string, unknown>;
  if (Object.keys(value).some(key => !['name','url','intervalSeconds'].includes(key))) throw new Error('Unknown field');
  if (typeof value['name'] !== 'string' || !value['name'].trim() || value['name'].trim().length > 80) throw new Error('Invalid name');
  if (typeof value['url'] !== 'string') throw new Error('Invalid URL');
  const interval = value['intervalSeconds'];
  if (typeof interval !== 'number' || !Number.isInteger(interval) || interval < 5 || interval > 3600) throw new Error('Invalid interval');
  return { name: value['name'].trim(), url: validateMonitorUrl(value['url']), intervalSeconds: interval };
}
export type Proposal = { kind: 'call'; tool: string; input: unknown } | { kind: 'finish'; answer: string };
export interface Agent { propose(observations: readonly string[]): Promise<Proposal> }
export type Tool = (input: unknown) => string;
export async function runAgent(agent: Agent, tools: Readonly<Record<string, Tool>>, maxSteps: number): Promise<readonly string[]> {
  if (!Number.isInteger(maxSteps) || maxSteps < 1 || maxSteps > 100) throw new Error('Invalid budget');
  const observations: string[] = [];
  for (let step = 0; step < maxSteps; step++) {
    const proposal: unknown = await agent.propose(Object.freeze([...observations]));
    if (typeof proposal !== 'object' || proposal === null) throw new Error('Invalid proposal');
    const p = proposal as Record<string, unknown>;
    if (p['kind'] === 'finish' && typeof p['answer'] === 'string') return [...observations, p['answer']];
    if (p['kind'] !== 'call' || typeof p['tool'] !== 'string' || !Object.hasOwn(tools, p['tool'])) throw new Error('Forbidden tool');
    const tool = tools[p['tool']];
    if (!tool) throw new Error('Unavailable tool');
    const observation = tool(p['input']);
    if (typeof observation !== 'string' || observation.length > 4000) throw new Error('Invalid observation');
    observations.push(observation);
  }
  throw new Error('Step budget exhausted');
}
export function readEvidence(root: string, candidate: string): string {
  if (isAbsolute(candidate)) throw new Error('Relative path required');
  const realRoot = realpathSync(root);
  const realFile = realpathSync(resolve(realRoot, candidate));
  const local = relative(realRoot, realFile);
  if (local === '..' || local.startsWith('..' + sep) || isAbsolute(local)) throw new Error('Path outside root');
  const text = readFileSync(realFile, 'utf8');
  if (text.length > 4000) throw new Error('Evidence too large');
  return text;
}
export interface Event { key: string; message: string }
export function appendEvents(db: DatabaseSync, events: readonly Event[]): void {
  db.exec('CREATE TABLE IF NOT EXISTS events (key TEXT PRIMARY KEY, message TEXT NOT NULL) STRICT');
  db.exec('BEGIN IMMEDIATE');
  try {
    const insert = db.prepare('INSERT INTO events(key,message) VALUES (?,?)');
    for (const event of events) {
      if (!event.key || !event.message) throw new Error('Invalid event');
      insert.run(event.key,event.message);
    }
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}
export function canonicalizeBatch(urls: readonly string[]): string[] {
  return [...new Set(urls.map(validateMonitorUrl))];
}
export interface Decision { expected: boolean; actual: boolean }
export function scoreDecisions(rows: readonly Decision[]) {
  let tp=0, fp=0, fn=0, tn=0;
  for (const row of rows) {
    if (row.expected && row.actual) tp++;
    else if (!row.expected && row.actual) fp++;
    else if (row.expected && !row.actual) fn++;
    else tn++;
  }
  return { tp, fp, fn, tn, precision: tp+fp ? tp/(tp+fp) : null, recall: tp+fn ? tp/(tp+fn) : null };
}
export interface Evidence { check: string; status: 'passed' | 'failed' | 'skipped'; revision: string }
export function releaseGate(rows: readonly Evidence[], revision: string, required: readonly string[]): boolean {
  if (!revision || required.length === 0 || new Set(required).size !== required.length) return false;
  return required.every(check => {
    const matches = rows.filter(row => row.check === check);
    return matches.length === 1 && matches[0]?.status === 'passed' && matches[0]?.revision === revision;
  });
}

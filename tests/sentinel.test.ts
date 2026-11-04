import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { SentinelStore } from '../apps/sentinel/src/store.js';
import { validateMonitorUrl } from '../packages/url-policy/src/index.js';
test('persists canonical URL across connections and rejects duplicates', () => {
  mkdirSync('artifacts', { recursive: true });
  const dir = mkdtempSync(join('artifacts', 'ase-test-'));
  const path = join(dir, 'test.sqlite');
  try {
    const first = new SentinelStore(path);
    try {
      assert.deepEqual(first.add(' Example ', 'https://EXAMPLE.com#status'),
        { id: 1, name: 'Example', url: 'https://example.com/' });
      assert.throws(() => first.add('Duplicate', 'https://example.com/'));
    } finally { first.close(); }
    const second = new SentinelStore(path);
    try { assert.equal(second.list().length, 1); } finally { second.close(); }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test('invalid inputs never create rows; SQL input remains data', () => {
  const store = new SentinelStore(':memory:');
  try {
    for (const name of ['', '   ', 'x'.repeat(81)]) assert.throws(() => store.add(name, 'https://example.com'));
    for (const url of ['invalid', 'file:///tmp/a', 'ftp://example.com', 'https://user:pass@example.com'])
      assert.throws(() => store.add('Invalid', url));
    assert.deepEqual(store.list(), []);
    store.add("'); DROP TABLE monitors; --", 'https://example.com');
    assert.equal(store.list().length, 1);
  } finally { store.close(); }
});
test('policy canonicalizes and removes fragments without altering query', () => {
  assert.equal(validateMonitorUrl('http://EXAMPLE.com:80/a?q=1#x'), 'http://example.com/a?q=1');
});
test('compiled CLI persists and reports failures through exit code', () => {
  mkdirSync('artifacts', { recursive: true });
  const dir = mkdtempSync(join('artifacts', 'ase-cli-'));
  const env = { ...process.env, SENTINEL_DB: join(dir, 'cli.sqlite') };
  const run = (...args: string[]) => spawnSync(process.execPath,
    ['dist/apps/sentinel/src/cli.js', ...args], { env, encoding: 'utf8' });
  try {
    assert.equal(run('add', 'Example', 'https://example.com').status, 0);
    const listing = run('list');
    assert.equal(listing.status, 0);
    assert.equal((JSON.parse(listing.stdout) as unknown[]).length, 1);
    assert.equal(run('add', 'Bad', 'file:///tmp/a').status, 1);
    assert.equal(run('unknown').status, 1);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

import { SentinelStore } from './store.js';
const [command, name, url, ...extra] = process.argv.slice(2);
if ((command === 'list' && name === undefined) ||
    (command === 'add' && name !== undefined && url !== undefined && extra.length === 0)) {
  const store = new SentinelStore(process.env['SENTINEL_DB'] ?? 'sentinel.sqlite');
  try {
    console.log(JSON.stringify(command === 'add' ? store.add(name!, url!) : store.list(), null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Unexpected error');
    process.exitCode = 1;
  } finally { store.close(); }
} else {
  console.error('Usage: sentinel add <name> <url> | sentinel list');
  process.exitCode = 1;
}

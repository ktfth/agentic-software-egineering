const { runContract } = await import('../dist/tests/lab-contracts.js');
const [id, variant] = process.argv.slice(2);
try { await runContract(id, variant); console.log(`PASS lab ${id} ${variant}`); }
catch (error) { console.error(error); process.exitCode = 1; }

import { spawnSync } from 'node:child_process';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const slugs=['01-url-policy','02-specifications','03-planning','04-tool-boundaries','05-migrations','06-regression','07-evaluation','08-delivery'];
const command=process.platform==='win32'?'npm.cmd':'npm';
function run(args, expected) {
 const result=spawnSync(command,args,{encoding:'utf8',shell:process.platform==='win32'});
 console.log(`npm ${args.join(' ')} => ${result.status}`);
 assert.equal(result.status,expected,result.stderr+result.stdout);
}
run(['ci'],0);
run(['run','validate'],0);
for(let i=0;i<8;i++) {
 const id=String(i+1).padStart(2,'0');const file=`labs/${slugs[i]}/starter/src/policy.ts`;
 const before=readFileSync(file,'utf8');
 try {
  run(['run','lab','--',id,'starter'],1);
  cpSync(`labs/${slugs[i]}/solution/src/policy.ts`,file);
  run(['run','lab','--',id,'starter'],0);
 } finally {writeFileSync(file,before);}
}
run(['run','validate'],0);
console.log('All 8 starter red→green paths verified; original starters restored');

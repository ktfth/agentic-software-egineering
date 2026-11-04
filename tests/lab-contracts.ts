import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
const slugs = ['01-url-policy','02-specifications','03-planning','04-tool-boundaries','05-migrations','06-regression','07-evaluation','08-delivery'];
export async function runContract(id: string | undefined, variant: string | undefined): Promise<void> {
  const index = Number(id)-1;
  if (!id || !Number.isInteger(index) || index<0 || index>7 || !['starter','solution'].includes(variant ?? '')) throw new Error('Usage: npm run lab -- 01..08 starter|solution');
  const module = await import(`../labs/${slugs[index]}/${variant}/src/policy.js`) as typeof import('../packages/agent-runtime/src/index.js') & typeof import('../packages/url-policy/src/index.js');
  switch(index+1) {
    case 1:
      assert.equal(module.validateMonitorUrl('https://EXAMPLE.com:443/a?q=1#x'),'https://example.com/a?q=1');
      assert.equal(module.validateMonitorUrl('http://example.com'),'http://example.com/');
      for (const value of ['invalid','/relative','file:///tmp/a','ftp://example.com','javascript:alert(1)','https://user@example.com','https://user:pass@example.com']) assert.throws(()=>module.validateMonitorUrl(value));
      break;
    case 2:
      assert.deepEqual(module.parseMonitorSpec({name:' Demo ',url:'https://EXAMPLE.com#x',intervalSeconds:5}),{name:'Demo',url:'https://example.com/',intervalSeconds:5});
      for (const value of [null,[],{}, {name:'x',url:'https://example.com',intervalSeconds:4}, {name:'x',url:'https://example.com',intervalSeconds:5,secret:'x'}, {name:'x',url:'file:///tmp/a',intervalSeconds:5}]) assert.throws(()=>module.parseMonitorSpec(value));
      break;
    case 3: {
      let calls=0;
      const result = await module.runAgent({propose:async observations=>observations.length ? {kind:'finish',answer:'done'} : {kind:'call',tool:'count',input:2}}, { count: input => {calls++; assert.equal(input,2); return '2';} }, 2);
      assert.deepEqual(result,['2','done']); assert.equal(calls,1);
      await assert.rejects(()=>module.runAgent({propose:async()=>({kind:'call',tool:'count',input:null})},{count:()=> 'x'},2),/budget/);
      await assert.rejects(()=>module.runAgent({propose:async()=>({kind:'call',tool:'delete',input:null})},{},2),/Forbidden/);
      await assert.rejects(()=>module.runAgent({propose:async()=>({kind:'finish',answer:'x'})},{},0),/budget/);
      break;
    }
    case 4: {
      mkdirSync('artifacts',{recursive:true});const dir=mkdtempSync(resolve('artifacts','tool-'));
      try {
        mkdirSync(join(dir,'root'));writeFileSync(join(dir,'root','ok.txt'),'evidence');writeFileSync(join(dir,'secret.txt'),'private');
        assert.equal(module.readEvidence(join(dir,'root'),'ok.txt'),'evidence');
        assert.throws(()=>module.readEvidence(join(dir,'root'),'../secret.txt'));
        assert.throws(()=>module.readEvidence(join(dir,'root'),resolve(dir,'secret.txt')));
        if (process.platform !== 'win32') {symlinkSync(join(dir,'secret.txt'),join(dir,'root','escape'));assert.throws(()=>module.readEvidence(join(dir,'root'),'escape'));}
      } finally {rmSync(dir,{recursive:true,force:true});}
      break;
    }
    case 5: {
      const db=new DatabaseSync(':memory:');
      try {
        module.appendEvents(db,[{key:'a',message:'first'}]);
        assert.throws(()=>module.appendEvents(db,[{key:'b',message:'second'},{key:'a',message:'duplicate'}]));
        assert.equal(db.prepare('SELECT count(*) AS n FROM events').get()?.['n'],1);
        module.appendEvents(db,[{key:'c',message:'third'}]);
        assert.equal(db.prepare('SELECT count(*) AS n FROM events').get()?.['n'],2);
      } finally {db.close();}
      break;
    }
    case 6: {
      const input=['https://EXAMPLE.com#x','https://example.com/','http://example.com/a?q=1#z'];
      const result=module.canonicalizeBatch(input);assert.deepEqual(result,['https://example.com/','http://example.com/a?q=1']);
      assert.deepEqual(module.canonicalizeBatch(result),result);assert.equal(input.length,3);
      assert.throws(()=>module.canonicalizeBatch(['https://example.com','file:///tmp/a']));
      assert.deepEqual(module.canonicalizeBatch([]),[]);break;
    }
    case 7:
      assert.deepEqual(module.scoreDecisions([{expected:true,actual:true},{expected:false,actual:true},{expected:true,actual:false},{expected:false,actual:false}]),{tp:1,fp:1,fn:1,tn:1,precision:0.5,recall:0.5});
      assert.deepEqual(module.scoreDecisions([]),{tp:0,fp:0,fn:0,tn:0,precision:null,recall:null});
      assert.equal(module.scoreDecisions([{expected:true,actual:false}]).recall,0);break;
    case 8: {
      const rows=[{check:'tests',status:'passed' as const,revision:'abc'}];
      assert.equal(module.releaseGate(rows,'abc',['tests']),true);
      assert.equal(module.releaseGate(rows,'def',['tests']),false);
      assert.equal(module.releaseGate(rows,'abc',['tests','build']),false);
      assert.equal(module.releaseGate([...rows,...rows],'abc',['tests']),false);
      assert.equal(module.releaseGate([],'abc',[]),false);
      assert.equal(module.releaseGate([{check:'tests',status:'skipped',revision:'abc'}],'abc',['tests']),false);break;
    }
  }
}

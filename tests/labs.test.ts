import { test } from 'node:test';
import { runContract } from './lab-contracts.js';
for (let i=1;i<=8;i++) test(`lab ${String(i).padStart(2,'0')} reference contract`,()=>runContract(String(i).padStart(2,'0'),'solution'));

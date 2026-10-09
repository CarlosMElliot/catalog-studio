import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePlanAssignment,accountMonthlyPrice} from '../lib/plans.ts';
test('custom plan stores exact GB quota and integer USD cents',()=>{
 assert.deepEqual(resolvePlanAssignment('custom','25.50','249.99'),{id:'custom',bytes:25_500_000_000,priceCents:24999});
 assert.equal(accountMonthlyPrice({plan:'custom',monthly_price_cents:24999}),249.99);
});
test('fixed plan ignores client-supplied quota and price',()=>{
 assert.deepEqual(resolvePlanAssignment('essential','999','0'),{id:'essential',bytes:1_000_000_000,priceCents:null});
});
test('custom plan rejects blank, negative, malformed and over-precision values',()=>{
 for(const [g,p] of [['','40'],['0','40'],['-1','40'],['2','-1'],['abc','40'],['2.001','40'],['2','40.001'],['1e3','40'],['Infinity','40']])assert.throws(()=>resolvePlanAssignment('custom',g,p));
 assert.equal(resolvePlanAssignment('custom','0.01','0').bytes,10_000_000);
 assert.throws(()=>resolvePlanAssignment('forged','10','40'));
});

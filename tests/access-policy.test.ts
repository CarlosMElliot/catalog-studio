import test from 'node:test';
import assert from 'node:assert/strict';
import {isFounderEmail} from '../lib/auth/access-policy.ts';

test('founder requires a configured identity and an authenticated match',()=>{
 assert.equal(isFounderEmail('founder@example.com',undefined),false);
 assert.equal(isFounderEmail(undefined,'founder@example.com'),false);
 assert.equal(isFounderEmail('',''),false);
 assert.equal(isFounderEmail('customer@example.com','founder@example.com'),false);
 assert.equal(isFounderEmail(' FOUNDER@example.com ','founder@example.com'),true);
});

import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
test('customer feature tree has no founder UI imports, server imports or admin navigation',()=>{
 const dir=resolve('features/customer/components');
 for(const name of readdirSync(dir)){
  const source=readFileSync(resolve(dir,name),'utf8');
  assert.doesNotMatch(source,/from\s+['"][^'"]*(?:features\/admin|lib\/server)/,name);
  assert.doesNotMatch(source,/href=["']\/admin/,name);
 }
});

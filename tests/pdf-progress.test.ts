import test from 'node:test';
import assert from 'node:assert/strict';
import {pdfPageProgress} from '../lib/pdf-progress.ts';
test('page progress is monotonic and reserves completion for the download handoff',()=>{
 const values=Array.from({length:101},(_,i)=>pdfPageProgress(i,100,'Rendering').percent);
 assert.equal(values[0],5);assert.equal(values[100],95);
 assert.ok(values.every((v,i)=>i===0||v>=values[i-1]));
 assert.equal(pdfPageProgress(1,1,'Done rendering').percent,95);
 assert.equal(pdfPageProgress(-1,10,'Starting').completedPages,0);
 assert.equal(pdfPageProgress(12,10,'Done rendering').completedPages,10);
});

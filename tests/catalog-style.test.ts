import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendStyles,validStyle,questions} from '../lib/catalog-style.ts';
import {pagePlan} from '../lib/pdf-export.ts';
import {blankProduct,validateCatalogs,brandDefault} from '../lib/catalog.ts';
test('survey has ten questions and produces valid persisted designs without losing codes',()=>{
 const answers=[[0],[1],[0],[3],[2],[0,1,3],[0],[5],[0],[0]];
 const recommendations=recommendStyles(answers);assert.equal(questions.length,10);assert.equal(recommendations.length,3);
 for(const r of recommendations)assert.ok(validStyle(r.style));
 const p={...blankProduct(),sku:'00123',upc:'00123456'};
 assert.ok(validateCatalogs([{id:'one',name:'Catalog',brand:brandDefault,products:[p],updated:'',style:recommendations[0].style}]));
 assert.equal(p.sku,'00123');assert.ok(!validStyle({...recommendations[0].style,font:99}));
 assert.ok(!validStyle({...recommendations[0].style,answers:[[99]]}));
});
test('phone use favors readable cards and A4 selection is respected',()=>{
 const answers=[[0],[0],[0],[0],[2],[0],[0],[0],[0],[3]];
 assert.equal(recommendStyles(answers)[0].style.layout,'showcase');answers[9]=[1];assert.equal(recommendStyles(answers)[0].style.format,'a4');
});
test('mixed layout reserves a hero page per category and index offsets stay correct',()=>{
 const products=Array.from({length:12},(_,i)=>({...blankProduct(),category:i<10?'First':'Second'}));
 const plan=pagePlan(products,9,true,true,true);
 assert.deepEqual(plan.pages.map(p=>p.products.length),[1,9,1,1]);
 assert.deepEqual(plan.entries.map(e=>e.page),[3,5]);assert.equal(plan.total,6);
});

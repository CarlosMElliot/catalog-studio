import test from 'node:test';
import assert from 'node:assert/strict';
import {documentPlan,emptyDocument,validDocument} from '../lib/catalog-document.ts';
import {blankProduct,brandDefault,validateCatalogs} from '../lib/catalog.ts';
import {templates,templateStyle,recommendStyles,validStyle} from '../lib/catalog-style.ts';
const products=Array.from({length:11},(_,i)=>({...blankProduct(),id:String(i),category:i<10?'Starters':'Desserts'}));
test('contents includes front/back sections, category dividers and exact page numbers',()=>{
 const doc={...emptyDocument(),dividers:true,sections:[{id:'intro',kind:'introduction' as const,title:'Welcome',body:'Hello',position:'before' as const},{id:'contact',kind:'contact' as const,title:'Contact',body:'Call us',position:'after' as const}]};
 const plan=documentPlan(products,8,true,true,false,doc);
 for(const entry of plan.entries)assert.equal(plan.pages[entry.page-1].title,entry.title);
 assert.deepEqual(plan.pages.map(p=>p.kind),['cover','contents','section','divider','products','products','divider','products','section']);
 assert.equal(plan.total,9);assert.equal(plan.entries.at(-1)?.page,9);
 const saved=JSON.parse(JSON.stringify([{id:'c',name:'Menu',brand:brandDefault,products,document:doc,updated:''}]));assert.ok(validateCatalogs(saved));
});
test('multi-page contents and changing section order recalculate offsets',()=>{
 const doc={...emptyDocument(),sections:Array.from({length:26},(_,i)=>({id:String(i),kind:'notes' as const,title:'Section '+i,body:'',position:'before' as const}))};
 const plan=documentPlan([],8,false,true,false,doc);assert.equal(plan.indexPages,2);assert.equal(plan.entries[0].page,3);assert.equal(plan.entries[25].page,28);
 const reversed=documentPlan([],8,false,true,false,{...doc,sections:[...doc.sections].reverse()});assert.equal(reversed.entries[0].title,'Section 25');assert.equal(reversed.entries[0].page,3);
 assert.ok(!validDocument({...doc,sections:[doc.sections[0],doc.sections[0]]}));
});
test('all fifteen presets generate valid styles and restaurant recommendations use menu content',()=>{
 const answers=[[6],[0],[0],[0],[2],[0],[0],[5],[9],[0]];
 const recommendation=recommendStyles(answers)[0].style;
 assert.equal(recommendation.layout,'menu');assert.equal(recommendation.palette,6);assert.ok(recommendation.fields.includes('tags'));assert.ok(validStyle(recommendation));
 assert.equal(templates.length,15);for(const t of templates)assert.ok(validStyle(templateStyle(t.id,recommendation)),t.id);
});

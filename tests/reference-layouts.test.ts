import test from 'node:test';
import assert from 'node:assert/strict';
import {layouts,recommendStyles} from '../lib/catalog-style.ts';
import {rangePagePlan,validCampaign,blankCampaign,validPromotion} from '../lib/wholesale-layouts.ts';
import {blankProduct} from '../lib/catalog.ts';
import {productCard} from '../lib/pdf-card.ts';
test('reference layouts preserve all standard choices and every design prints the actual barcode',()=>{
 assert.deepEqual(layouts.slice(0,8).map(l=>l.id),['showcase','balanced','wholesale','editorial','technical','mixed','menu','cafe']);
 const base=recommendStyles([[0],[0],[0],[0],[0],[0,1],[0],[0],[0],[0]])[0].style;
 for(const layout of layouts){const html=productCard({...blankProduct(),name:'A < B',upc:'001234567890',sku:'0001'},{style:{...base,layout:layout.id},visible:['image','upc','sku'],count:layout.count,color:'#123456',heading:'Arial'});assert.ok(html.includes('data-pdf-barcode="001234567890"'),layout.id);assert.ok(html.includes('A &lt; B'));}
});
test('grouped wholesale pages never lose items and use actual contents-page offsets',()=>{
 const items=Array.from({length:29},(_,i)=>({...blankProduct(),id:String(i),category:'Category '+i}));
 const plan=rangePagePlan(items,true,true);assert.equal(plan.indexPages,2);assert.equal(plan.entries[0].page,4);assert.equal(plan.entries[28].page,18);assert.deepEqual(plan.pages.flatMap(p=>p.products).map(p=>p.id),items.map(p=>p.id));
});
test('campaign dates and user-entered promotions validate safely',()=>{
 assert.ok(validCampaign(blankCampaign()));assert.ok(!validCampaign({...blankCampaign(),startDate:'2026-10-10',endDate:'2026-10-09'}));assert.ok(validPromotion({regularPrice:'12.50',priceUnit:'per case',label:'Limited offer'}));assert.ok(!validPromotion({regularPrice:'-5',priceUnit:'',label:''}));
});

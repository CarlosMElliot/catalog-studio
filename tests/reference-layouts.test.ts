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

import {businessLayouts,surveySteps} from '../lib/catalog-style.ts';
import {collectionPage,collectionCover,collectionContents} from '../lib/collection-pages.ts';
test('business recommendations stay relevant without changing saved indices',()=>{
 assert.ok(businessLayouts(1).includes('bridal-elegance'));assert.ok(businessLayouts(2).includes('aqua-skincare'));assert.ok(businessLayouts(0,3).includes('weekend-deals'));
 const answers=Array.from({length:20},()=>[0]);answers[10]=[2];assert.ok(!surveySteps(answers,false).includes(18));assert.ok(!surveySteps(answers,false).includes(19));assert.ok(surveySteps(answers,true).includes(19));
});
test('editorial compositions retain products, barcodes, escaped text and actual contents page numbers',()=>{
 const base=recommendStyles([[1],[0],[0],[0],[11],[0,1],[0],[2],[0],[0]])[0].style;
 const products=Array.from({length:4},(_,i)=>({...blankProduct(),name:'Product <'+i,upc:'00000'+i,sku:'sku'+i}));
 for(const layout of ['seasonal-fashion','aqua-skincare']){const html=collectionPage(products,{...base,layout},['upc'],'Georgia');for(const p of products)assert.ok(html.includes('data-pdf-barcode="'+p.upc+'"'));assert.ok(html.includes('1.15fr'));assert.ok(html.includes('Product &lt;'));}
 const contents=collectionContents([{category:'A < B',count:5,page:14}],{...base,layout:'seasonal-fashion'},'Georgia');assert.ok(contents.includes('A &lt; B'));assert.ok(contents.includes('<strong>14</strong>'));
 const cover=collectionCover({id:'a',name:'a',brand:{company:'Brand',title:'Collection',subtitle:'',logo:'',accent:'#000000',address:'Private',phone:'',email:'',website:''},products:[],updated:''},[],{...base,layout:'seasonal-fashion',contacts:false},'Georgia');assert.ok(!cover.includes('Private'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {layouts,expandedAnswers,recommendStyles,barcodeValue,descriptionText,orderedProducts,validStyle} from '../lib/catalog-style.ts';
import {productCard} from '../lib/pdf-card.ts';
import {blankProduct} from '../lib/catalog.ts';
const answers=Array.from({length:20},()=>[0]);answers[5]=[0,1,2];
test('every layout renders vector barcode placeholders from the selected identifier',()=>{
 const p={...blankProduct(),name:'Product',sku:'00123',upc:'000123456789'};
 const base=recommendStyles(answers)[0].style;assert.ok(validStyle(base));
 for(const layout of layouts){const style={...base,layout:layout.id};const opts={style,visible:style.fields,count:layout.count,color:'#164d47',heading:'Roboto'};
 assert.match(productCard(p,opts),/data-pdf-barcode="000123456789"/,layout.id);
 assert.match(productCard(p,{...opts,style:{...style,barcodeSource:'sku'}}),/data-pdf-barcode="00123"/,layout.id);
 assert.doesNotMatch(productCard(p,{...opts,style:{...style,barcodeSource:'none'}}),/data-pdf-barcode/,layout.id);
 }
});
test('missing-barcode policy is explicit and never mutates product identifiers',()=>{
 const p={...blankProduct(),name:'Soup',sku:'00042'};const style=recommendStyles(answers)[0].style;
 assert.equal(barcodeValue(p,{...style,missingBarcode:'omit'}),'');
 assert.equal(barcodeValue(p,{...style,missingBarcode:'sku'}),'00042');
 assert.throws(()=>barcodeValue(p,{...style,missingBarcode:'block'}),/Missing barcode for 00042/);
 assert.equal(p.upc,'');assert.equal(p.sku,'00042');
});
test('saved questionnaire decisions control descriptions, photos, cover, contents and contacts',()=>{
 const a=answers.map(v=>[...v]);a[10]=[2];a[11]=[2];a[12]=[1];a[13]=[1];a[14]=[1];a[17]=[1];a[19]=[1];
 const style=recommendStyles(a)[0].style;assert.ok(validStyle(style));assert.equal(style.cover,false);assert.equal(style.index,false);assert.equal(style.contacts,false);assert.equal(style.inheritBrand,false);assert.ok(!style.fields.includes('upc'));assert.ok(!style.fields.includes('image'));assert.ok(descriptionText('x'.repeat(300),style).length<=180);
 assert.equal(expandedAnswers().length,20);assert.ok(expandedAnswers().every(a=>a.length===0));
});
test('category sorting preserves saved product order and old ten-question surveys reopen safely',()=>{
 const old=recommendStyles(answers.slice(0,10))[0].style;assert.ok(validStyle(old));assert.equal(expandedAnswers(old).length,20);
 const p=[{category:'Z',name:'b'},{category:'A',name:'c'},{category:'A',name:'a'}];
 assert.deepEqual(orderedProducts(p,{...old,sort:'name'}).map(p=>p.name),['a','c','b']);assert.equal(p[0].category,'Z');
 assert.ok(!validStyle({...old,barcodeSource:'invent'}));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {fonts,catalogFont,recommendedFont,validStyle,questions} from '../lib/catalog-style.ts';
import {quickDefaults,quickBusiness,quickLayout} from '../lib/quick-survey.ts';
import {productCard} from '../lib/pdf-card.ts';
import {blankProduct} from '../lib/catalog.ts';
test('automatic typography varies by industry and template without changing legacy indices',()=>{
 assert.equal(fonts[0].heading,'Roboto');assert.equal(fonts[2].heading,'Playfair Display');assert.equal(questions[7][1][5],'Choose for me');
 const s=quickDefaults();assert.equal(s.fontMode,'auto');assert.equal(catalogFont(quickBusiness(s,1)).heading,'Bodoni Moda');assert.equal(catalogFont(quickBusiness(s,2)).heading,'DM Sans');assert.equal(catalogFont(quickBusiness(s,4)).heading,'IBM Plex Sans');assert.equal(catalogFont(quickBusiness(s,6)).heading,'Lora');
 assert.notEqual(recommendedFont(1,'bridal-elegance'),recommendedFont(1,'bold-fashion'));for(let b=0;b<7;b++)assert.ok(validStyle(quickBusiness(s,b)));
});
test('manual and legacy fonts are preserved while automatic designs resolve per thumbnail',()=>{
 const s=quickDefaults();const manual={...s,font:4,fontMode:'manual' as const};assert.equal(quickLayout(quickBusiness(manual,2),'aqua-skincare').font,4);assert.equal(catalogFont(manual).heading,'Libre Baskerville');
 const legacy={...manual,fontMode:undefined};assert.equal(quickDefaults(legacy).fontMode,'manual');assert.equal(catalogFont({...s,layout:'bridal-elegance'}).heading,'Cormorant Garamond');assert.ok(!validStyle({...s,fontMode:'invalid'}));
});
test('wholesale names honor the selected typography rather than hard-coded Arial',()=>{
 const s=quickLayout(quickDefaults(),'weekly-featured');const html=productCard({...blankProduct(),name:'Sample'},{style:s,visible:[],count:6,color:'#000000',heading:catalogFont(s).heading});assert.ok(html.includes("'Oswald',Arial"));
});

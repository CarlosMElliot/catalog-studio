import test from 'node:test';
import assert from 'node:assert/strict';
import {drawPdfBarcode,checkExportCancelled,PDF_SCALE} from '../lib/pdf-quality.ts';
test('barcodes use bounded vector rectangles and retain leading zeros',()=>{
 const rectangles:number[][]=[],texts:string[]=[];
 const pdf={setFillColor(){},setTextColor(){},setFont(){},setFontSize(){},rect(...v:any[]){rectangles.push(v.slice(0,4));},text(value:string){texts.push(value);}};
 drawPdfBarcode(pdf,'001234567890',10,20,150,30);
 assert.deepEqual(texts,['001234567890']);assert.ok(rectangles.length>20);
 for(const [x,y,w,h] of rectangles){assert.ok(x>=10&&x+w<=160.00001);assert.ok(y>=20&&y+h<=50);}
 assert.ok(rectangles[1][0]>10);assert.equal(816*PDF_SCALE,2550);assert.equal(1056*PDF_SCALE,3300);
});
test('cancel checkpoint rejects before further work and fresh exports remain usable',()=>{
 const controller=new AbortController();checkExportCancelled(controller.signal);controller.abort();
 assert.throws(()=>checkExportCancelled(controller.signal),{name:'AbortError'});
 checkExportCancelled(new AbortController().signal);
});

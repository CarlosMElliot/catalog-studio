import test from 'node:test';
import assert from 'node:assert/strict';
import XLSX from 'xlsx';
test('downloadable template is blank by default and preserves example codes for the importer',()=>{
 const w=XLSX.readFile('public/templates/catalog-import-template.xlsx',{cellNF:true,sheetStubs:true,cellStyles:true});
 assert.deepEqual(w.SheetNames,['Products','Examples','Instructions']);
 const rows=XLSX.utils.sheet_to_json<string[]>(w.Sheets.Products,{header:1,raw:false,defval:''});
 assert.deepEqual(rows[0],['Item Code','Item Name','Category','Description','Pack Size','UPC Code','List Price','Stock','Brand','Tags','Active']);
 assert.ok(rows.slice(1).every(r=>r.every(v=>v==='')));
 const ex=XLSX.utils.sheet_to_json<string[]>(w.Sheets.Examples,{header:1,raw:false,defval:''});
 assert.equal(ex[1][0],'0001001');assert.equal(ex[1][5],'001234567890');assert.equal(ex[2][6],'0.00');assert.equal(ex[2][10],'No');
 assert.equal(w.Sheets.Products.A2.z,'@');assert.equal(w.Sheets.Products.F2.z,'@');
});

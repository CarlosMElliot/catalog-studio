import JsBarcode from 'jsbarcode';
export const PDF_SCALE=300/96;
export function checkExportCancelled(signal?:AbortSignal){if(signal?.aborted)throw new DOMException('Export cancelled','AbortError');}
/** Draw CODE128 directly in PDF points, with ten-module quiet zones. */
export function drawPdfBarcode(pdf:any,value:string,x:number,y:number,width:number,height:number){
 const encoded:any={};
 try{JsBarcode(encoded,value,{format:'CODE128',displayValue:false});}catch{throw Error(`Barcode cannot be generated for ${value}. Check the barcode field.`);}
 const bits=encoded.encodings.map((e:any)=>e.data).join('');
 const moduleWidth=Math.min(1,width/(bits.length+20));
 const left=x+(width-bits.length*moduleWidth)/2;
 pdf.setFillColor(255,255,255);pdf.rect(x,y,width,height,'F');pdf.setFillColor(0,0,0);
 for(let i=0;i<bits.length;){if(bits[i]!=='1'){i++;continue;}let end=i+1;while(bits[end]==='1')end++;pdf.rect(left+i*moduleWidth,y,(end-i)*moduleWidth,height-10,'F');i=end;}
 pdf.setTextColor(0,0,0);pdf.setFont('helvetica','normal');pdf.setFontSize(Math.min(7,width/Math.max(value.length,1)*1.5));pdf.text(value,x+width/2,y+height-2,{align:'center'});
}

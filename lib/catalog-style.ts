import {collectionLayouts} from './collection-layouts.ts';
import {wholesaleLayouts} from './wholesale-layouts.ts';
export const layouts=[{id:'showcase',name:'Product showcase',count:4,description:'Four large product cards per page.'},{id:'balanced',name:'Balanced grid',count:9,description:'Nine products with photos and essential details.'},{id:'wholesale',name:'Wholesale grid',count:16,description:'Sixteen compact cards for quick ordering.'},{id:'editorial',name:'Editorial lookbook',count:1,description:'One hero product per page with room for its story.'},{id:'technical',name:'Technical catalog',count:3,description:'Three wide product panels with detailed descriptions.'},{id:'mixed',name:'Mixed layout',count:9,description:'A hero product opens each category, followed by nine-card grids.'},{id:'menu',name:'Restaurant menu',count:4,description:'Four dishes with aligned prices, optional photos and barcodes.'},{id:'cafe',name:'Café / food showcase',count:4,description:'Four large dish photos with descriptions and optional barcodes.'},...wholesaleLayouts,...collectionLayouts] as const;
export const fonts=[{name:'Clean & practical',heading:'Roboto',body:'Open Sans'},{name:'Modern & bold',heading:'Montserrat',body:'Open Sans'},{name:'Elegant & editorial',heading:'Playfair Display',body:'Lato'},{name:'Friendly & contemporary',heading:'Poppins',body:'Open Sans'},{name:'Traditional & professional',heading:'Libre Baskerville',body:'Source Sans 3'},{name:'Wholesale & ordering',heading:'Roboto Condensed',body:'Open Sans'},{name:'Fashion editorial',heading:'Bodoni Moda',body:'Lato'},{name:'Bridal & luxury',heading:'Cormorant Garamond',body:'Lato'},{name:'Beauty & personal care',heading:'DM Sans',body:'Open Sans'},{name:'Restaurant & home',heading:'Lora',body:'Source Sans 3'},{name:'Promotional headlines',heading:'Oswald',body:'Open Sans'},{name:'Technical & specifications',heading:'IBM Plex Sans',body:'Source Sans 3'}];
export const palettes=[{name:'Navy & teal',ink:'#17324D',paper:'#FFFFFF',accent:'#167D8D'},{name:'Forest & cream',ink:'#214E34',paper:'#FAF7EF',accent:'#B85C38'},{name:'Charcoal & gold',ink:'#202124',paper:'#FAF7F0',accent:'#B18A45'},{name:'Burgundy & blush',ink:'#752D43',paper:'#FFF9F2',accent:'#752D43'},{name:'Industrial orange',ink:'#252B33',paper:'#FFFFFF',accent:'#C75016'}];
export type StyleAnswers=number[][];
export type CatalogStyle={fontMode?:'auto'|'manual';barcodeSource?:'upc'|'sku'|'none';missingBarcode?:'omit'|'sku'|'block';imagePosition?:'above'|'beside'|'none';descriptionMode?:'full'|'brief'|'none';cover?:boolean;index?:boolean;contacts?:boolean;sort?:'original'|'category'|'name';inheritBrand?:boolean;answers:StyleAnswers;layout:string;font:number;palette:number;format:'letter'|'a4';fields:string[]};
export const questions=[
 ['What type of business is this catalog for?',['Wholesale, distribution or grocery','Fashion, clothing or accessories','Beauty, wellness or personal care','Furniture or home décor','Electronics, tools, automotive or industrial','Another industry / mixed products','Restaurant, café or food service']],
 ['Who will mainly use your catalog?',['Retail shoppers','Businesses placing wholesale orders','Sales representatives','Professional buyers comparing specifications','A mixture of audiences']],
 ['What should your catalog help people do?',['Find products and place orders','Discover our brand and collections','Compare features and specifications','Explore promotions and offers','Browse our complete range']],
 ['How many products will it contain?',['1–20','21–100','101–500','More than 500','It changes frequently']],
 ['Which layout do you prefer?',layouts.map(l=>l.name)],
 ['What information must appear? Select all that apply.',['Product name and image','Item code and barcode','Price','Pack size and stock availability','Specifications / dimensions in the description','Description, benefits and contact details']],
 ['What photos do you have?',['High-resolution product photos','High-resolution lifestyle photos','Both product and lifestyle photos','Mostly small or older images','Some products have no images']],
 ['Which font style matches your brand?',[...fonts.slice(0,5).map(f=>f.name+' — '+f.heading+' / '+f.body),'Choose for me']],
 ['Which color direction would you like?',[...palettes.map(p=>p.name),'Use my existing brand color']],
 ['How will customers mainly view it?',['Printed Letter PDF','Printed A4 PDF','Computer or tablet','Phone / messaging / email','Both print and digital']],
 ['Should products include scannable barcodes?',['Yes — use each product’s UPC / barcode field','Yes — generate from each item code (SKU)','No — hide barcodes in this catalog']],
 ['Where should product photos appear?',['Above the product details','Beside the product details','No product photos — text only']],
 ['How much description should buyers see?',['Full descriptions','Brief descriptions — first 180 characters','Names and selected facts only']],
 ['Would you like a branded cover page?',['Yes — logo, catalog title and subtitle','No — start with the catalog content']],
 ['Would you like a table of contents?',['Yes — categories with automatic page numbers','No — keep the catalog shorter']],
 ['How should products be ordered?',['Keep my current category and product order','Sort categories alphabetically','Sort categories and product names alphabetically']],
 ['Should tags appear under products or dishes?',['Yes — show my tags, such as dietary notes or collections','No — keep tags internal']],
 ['Should business contact details appear in the PDF?',['Yes — include saved contact information','No — hide contact information']],
 ['If a product is missing its barcode number, what should happen?',['Leave its barcode area empty','Use its item code (SKU) instead','Stop export and tell me which product needs a code']],
 ['Which branding should this new catalog use?',['Reuse my current catalog’s business details and logo','Start with blank business details and no logo']]

] as const;
export function validStyle(s:any):s is CatalogStyle{return !!s&&optionalSettingsValid(s)&&layouts.some(l=>l.id===s.layout)&&Number.isInteger(s.font)&&s.font>=0&&s.font<fonts.length&&Number.isInteger(s.palette)&&s.palette>=0&&s.palette<=5&&['letter','a4'].includes(s.format)&&Array.isArray(s.fields)&&s.fields.every((f:any)=>['image','sku','upc','price','pack','stock','description','brand','tags'].includes(f))&&Array.isArray(s.answers)&&[10,questions.length].includes(s.answers.length)&&s.answers.every((v:any,i:number)=>Array.isArray(v)&&v.length>0&&(i===5||v.length===1)&&v.every((n:any)=>Number.isInteger(n)&&n>=0&&n<questions[i][1].length));}
export function optionalSettingsValid(s:any){return Object.entries({fontMode:['auto','manual'],barcodeSource:['upc','sku','none'],missingBarcode:['omit','sku','block'],imagePosition:['above','beside','none'],descriptionMode:['full','brief','none'],sort:['original','category','name']}).every(([k,v])=>s[k]===undefined||v.includes(s[k]))&&['cover','index','contacts','inheritBrand'].every(k=>s[k]===undefined||typeof s[k]==='boolean');}
export function expandedAnswers(style?:CatalogStyle):StyleAnswers{
 if(!style)return Array.from({length:questions.length},()=>[]);
 const initial=style?.answers?.map(a=>[...a])||Array.from({length:10},()=>[]);
 const defaults=[[style?.fields.includes('upc')?0:2],[style?.fields.includes('image')?0:2],[style?.fields.includes('description')?0:2],[0],[0],[0],[1],[0],[0],[0]];
 const result=[...initial,...defaults.slice(Math.max(0,initial.length-10))];
 if(style.barcodeSource)result[10]=[['upc','sku','none'].indexOf(style.barcodeSource)];
 if(style.imagePosition)result[11]=[['above','beside','none'].indexOf(style.imagePosition)];
 if(style.descriptionMode)result[12]=[['full','brief','none'].indexOf(style.descriptionMode)];
 for(const [index,key] of [[13,'cover'],[14,'index'],[17,'contacts'],[19,'inheritBrand']] as const)if(style[key]!==undefined)result[index]=[style[key]?0:1];
 if(style.sort)result[15]=[['original','category','name'].indexOf(style.sort)];
 result[16]=[style.fields.includes('tags')?0:1];
 if(style.missingBarcode)result[18]=[['omit','sku','block'].indexOf(style.missingBarcode)];
 return result;
}
export function barcodeValue(product:{sku:string;upc:string;name:string},style?:CatalogStyle){
 if(style?.barcodeSource==='none')return '';if(style?.barcodeSource==='sku')return product.sku.trim();
 if(product.upc.trim())return product.upc.trim();if(style?.missingBarcode==='sku')return product.sku.trim();
 if(style?.missingBarcode==='block')throw Error(`Missing barcode for ${product.sku||product.name}. Add a code or change the missing-barcode setting.`);return '';
}
export function descriptionText(value:string,style?:CatalogStyle){return style?.descriptionMode==='none'?'':style?.descriptionMode==='brief'&&value.length>180?value.slice(0,177)+'…':value;}
export function orderedProducts<T extends {category:string;name:string}>(products:T[],style?:CatalogStyle):T[]{return !style?.sort||style.sort==='original'?[...products]:[...products].sort((a,b)=>a.category.localeCompare(b.category)||(style.sort==='name'?a.name.localeCompare(b.name):0));}
export function recommendStyles(answers:StyleAnswers):{label:string;reason:string;style:CatalogStyle}[]{
 const a=(i:number)=>answers[i]?.[0]??0;const fields=new Set<string>();
 for(const v of answers[5]||[])for(const f of [['image'],['sku','upc'],['price'],['pack','stock'],['description'],['description','brand']][v]||[])fields.add(f);
 const requested=layouts[a(4)]?.id||'balanced';
 const preferred=requested==='wholesale'&&(a(6)===1||fields.has('description')&&a(2)===2)?'technical':a(9)===3&&['wholesale','balanced'].includes(requested)?'showcase':requested;
 const business=['wholesale','fashion','beauty','home','technical','mixed','restaurant'][a(0)];const audience=['shoppers','wholesale buyers','sales teams','professional buyers','mixed audiences'][a(1)];const volume=['a small collection','up to 100 products','a large collection','over 500 products','a changing range'][a(3)];
 const extended=answers.length===questions.length;
 const barcodeSource=extended?(['upc','sku','none'] as const)[a(10)]:fields.has('upc')?'upc':'none';
 if(extended){barcodeSource==='none'?fields.delete('upc'):fields.add('upc');a(11)===2?fields.delete('image'):fields.add('image');a(12)===2?fields.delete('description'):fields.add('description');a(16)===0?fields.add('tags'):fields.delete('tags');}
 const style:CatalogStyle={answers,...(extended?{barcodeSource,missingBarcode:(['omit','sku','block'] as const)[a(18)],imagePosition:(['above','beside','none'] as const)[a(11)],descriptionMode:(['full','brief','none'] as const)[a(12)],cover:a(13)===0,index:a(14)===0,sort:(['original','category','name'] as const)[a(15)],contacts:a(17)===0,inheritBrand:a(19)===0}:{}),layout:preferred,font:a(7)===5?([1,2,3].includes(a(0))?2:0):a(7),palette:a(8),format:a(9)===1?'a4':'letter',fields:[...fields]};
 return [{label:'Best match',reason:preferred!==requested?'Adjusted for your reading format or detailed content.':`Matches your ${business} catalog for ${audience}, with ${volume}.`,style},{label:'More visual',reason:'Larger images and fewer products on each page.',style:{...style,layout:a(0)===1?'bridal-elegance':a(0)===2?'beauty-editorial':a(0)===6?'cafe':preferred==='showcase'?'editorial':'showcase'}},{label:'More compact',reason:'A denser layout for browsing larger product ranges.',style:{...style,layout:a(0)===1?'menswear-edit':a(0)===2?'care-collection':a(0)===6?'menu':preferred==='wholesale'?'balanced':'wholesale'}}];
}

/** Compatibility for catalogs saved during the reverted visual-editor release. */
export function compatibleCatalogStyle(style:any){
 if(!style||typeof style!=='object'||validStyle(style))return style;
 if(!['menu','cafe','comparison'].includes(style.layout)&&!(style.palette>5)&&!style.answers?.some((a:any,i:number)=>Array.isArray(a)&&a.some((n:number)=>n>=questions[i]?.[1].length)))return style;
 const answers=Array.isArray(style.answers)?style.answers.map((a:any,i:number)=>Array.isArray(a)?a.map((n:number)=>n>=questions[i]?.[1].length?(i===0?5:i===4?1:i===8?1:0):n):a):style.answers;
 return {...style,layout:['menu','cafe','comparison'].includes(style.layout)?'balanced':style.layout,palette:style.palette>5?1:style.palette,answers,fields:Array.isArray(style.fields)?style.fields.filter((f:string)=>f!=='tags'):style.fields};
}

/** Stable layout indices are preserved in saved answers; display order is independent. */
export function businessLayouts(business:number,purpose=0){
 const groups=[purpose===3?['weekly-featured','weekend-deals','wholesale-range']:['wholesale-range','wholesale','weekly-featured'],['seasonal-fashion','minimal-collection','bold-fashion','warm-lookbook','bridal-elegance','menswear-edit'],['aqua-skincare','beauty-editorial','care-collection'],['editorial','showcase','mixed'],['technical','balanced','wholesale'],['balanced','showcase','mixed'],['menu','cafe']];
 return groups[business]||groups[5];
}
export function surveySteps(answers:StyleAnswers,creating:boolean){return questions.map((_,i)=>i).filter(i=>!(i===18&&answers[10]?.[0]===2)&&!(i===19&&!creating));}

/** Catalog typography only: never changes the application theme. */
export function recommendedFont(business:number,layout:string){
 const template:Record<string,number>={'weekly-featured':10,'weekend-deals':10,'wholesale-range':5,'seasonal-fashion':6,'bold-fashion':1,'warm-lookbook':9,'minimal-collection':8,'bridal-elegance':7,'menswear-edit':1,'aqua-skincare':8,'beauty-editorial':2,'care-collection':7,'menu':9,'cafe':3,'technical':11};
 return template[layout]??[5,6,8,9,11,0,9][business]??0;
}
export function resolvedFontIndex(style?:CatalogStyle){return style?.fontMode==='auto'?recommendedFont(style.answers[0]?.[0]??5,style.layout):style?.font??0;}
export function catalogFont(style?:CatalogStyle){return fonts[resolvedFontIndex(style)]||fonts[0];}

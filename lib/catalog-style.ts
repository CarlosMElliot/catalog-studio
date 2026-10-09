export const layouts=[{id:'showcase',name:'Product showcase',count:4,description:'Four large product cards per page.'},{id:'balanced',name:'Balanced grid',count:9,description:'Nine products with photos and essential details.'},{id:'wholesale',name:'Wholesale grid',count:16,description:'Sixteen compact cards for quick ordering.'},{id:'editorial',name:'Editorial lookbook',count:1,description:'One hero product per page with room for its story.'},{id:'technical',name:'Technical catalog',count:3,description:'Three wide product panels with detailed descriptions.'},{id:'mixed',name:'Mixed layout',count:9,description:'A hero product opens each category, followed by nine-card grids.'}] as const;
export const fonts=[{name:'Clean & practical',heading:'Roboto',body:'Open Sans'},{name:'Modern & bold',heading:'Montserrat',body:'Open Sans'},{name:'Elegant & editorial',heading:'Playfair Display',body:'Lato'},{name:'Friendly & contemporary',heading:'Poppins',body:'Open Sans'},{name:'Traditional & professional',heading:'Libre Baskerville',body:'Source Sans 3'}];
export const palettes=[{name:'Navy & teal',ink:'#17324D',paper:'#FFFFFF',accent:'#167D8D'},{name:'Forest & cream',ink:'#214E34',paper:'#FAF7EF',accent:'#B85C38'},{name:'Charcoal & gold',ink:'#202124',paper:'#FAF7F0',accent:'#B18A45'},{name:'Burgundy & blush',ink:'#752D43',paper:'#FFF9F2',accent:'#752D43'},{name:'Industrial orange',ink:'#252B33',paper:'#FFFFFF',accent:'#C75016'}];
export type StyleAnswers=number[][];
export type CatalogStyle={answers:StyleAnswers;layout:string;font:number;palette:number;format:'letter'|'a4';fields:string[]};
export const questions=[
 ['What type of business is this catalog for?',['Wholesale, distribution or grocery','Fashion, clothing or accessories','Beauty, wellness or personal care','Furniture or home décor','Electronics, tools, automotive or industrial','Another industry / mixed products']],
 ['Who will mainly use your catalog?',['Retail shoppers','Businesses placing wholesale orders','Sales representatives','Professional buyers comparing specifications','A mixture of audiences']],
 ['What should your catalog help people do?',['Find products and place orders','Discover our brand and collections','Compare features and specifications','Explore promotions and offers','Browse our complete range']],
 ['How many products will it contain?',['1–20','21–100','101–500','More than 500','It changes frequently']],
 ['Which layout do you prefer?',layouts.map(l=>l.name)],
 ['What information must appear? Select all that apply.',['Product name and image','Item code and barcode','Price','Pack size and stock availability','Specifications / dimensions in the description','Description, benefits and contact details']],
 ['What photos do you have?',['High-resolution product photos','High-resolution lifestyle photos','Both product and lifestyle photos','Mostly small or older images','Some products have no images']],
 ['Which font style matches your brand?',[...fonts.map(f=>f.name+' — '+f.heading+' / '+f.body),'Choose for me']],
 ['Which color direction would you like?',[...palettes.map(p=>p.name),'Use my existing brand color']],
 ['How will customers mainly view it?',['Printed Letter PDF','Printed A4 PDF','Computer or tablet','Phone / messaging / email','Both print and digital']]
] as const;
export function validStyle(s:any):s is CatalogStyle{return !!s&&layouts.some(l=>l.id===s.layout)&&Number.isInteger(s.font)&&s.font>=0&&s.font<fonts.length&&Number.isInteger(s.palette)&&s.palette>=0&&s.palette<=5&&['letter','a4'].includes(s.format)&&Array.isArray(s.fields)&&s.fields.every((f:any)=>['image','sku','upc','price','pack','stock','description','brand'].includes(f))&&Array.isArray(s.answers)&&s.answers.length===10&&s.answers.every((v:any,i:number)=>Array.isArray(v)&&v.length>0&&(i===5||v.length===1)&&v.every((n:any)=>Number.isInteger(n)&&n>=0&&n<questions[i][1].length));}
export function recommendStyles(answers:StyleAnswers):{label:string;reason:string;style:CatalogStyle}[]{
 const a=(i:number)=>answers[i]?.[0]??0;const fields=new Set<string>();
 for(const v of answers[5]||[])for(const f of [['image'],['sku','upc'],['price'],['pack','stock'],['description'],['description','brand']][v]||[])fields.add(f);
 const requested=layouts[a(4)]?.id||'balanced';
 const preferred=requested==='wholesale'&&(a(6)===1||fields.has('description')&&a(2)===2)?'technical':a(9)===3&&['wholesale','balanced'].includes(requested)?'showcase':requested;
 const business=['wholesale','fashion','beauty','home','technical','mixed'][a(0)];const audience=['shoppers','wholesale buyers','sales teams','professional buyers','mixed audiences'][a(1)];const volume=['a small collection','up to 100 products','a large collection','over 500 products','a changing range'][a(3)];
 const style:CatalogStyle={answers,layout:preferred,font:a(7)===5?([1,2,3].includes(a(0))?2:0):a(7),palette:a(8),format:a(9)===1?'a4':'letter',fields:[...fields]};
 return [{label:'Best match',reason:preferred!==requested?'Adjusted for your reading format or detailed content.':`Matches your ${business} catalog for ${audience}, with ${volume}.`,style},{label:'More visual',reason:'Larger images and fewer products on each page.',style:{...style,layout:preferred==='showcase'?'editorial':'showcase'}},{label:'More compact',reason:'A denser layout for browsing larger product ranges.',style:{...style,layout:preferred==='wholesale'?'balanced':'wholesale'}}];
}

/** Compatibility for catalogs saved during the reverted visual-editor release. */
export function compatibleCatalogStyle(style:any){
 if(!style||typeof style!=='object')return style;
 if(!['menu','cafe','comparison'].includes(style.layout)&&!(style.palette>5)&&!style.answers?.some((a:any,i:number)=>Array.isArray(a)&&a.some((n:number)=>n>=questions[i]?.[1].length)))return style;
 const answers=Array.isArray(style.answers)?style.answers.map((a:any,i:number)=>Array.isArray(a)?a.map((n:number)=>n>=questions[i]?.[1].length?(i===0?5:i===4?1:i===8?1:0):n):a):style.answers;
 return {...style,layout:['menu','cafe','comparison'].includes(style.layout)?'balanced':style.layout,palette:style.palette>5?1:style.palette,answers,fields:Array.isArray(style.fields)?style.fields.filter((f:string)=>f!=='tags'):style.fields};
}

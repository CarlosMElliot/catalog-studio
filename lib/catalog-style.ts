export const layouts=[{id:'showcase',name:'Product showcase',count:4,description:'Four large product cards per page.'},{id:'balanced',name:'Balanced grid',count:9,description:'Nine products with photos and essential details.'},{id:'wholesale',name:'Wholesale grid',count:16,description:'Sixteen compact cards for quick ordering.'},{id:'editorial',name:'Editorial lookbook',count:1,description:'One hero product per page with room for its story.'},{id:'technical',name:'Technical catalog',count:3,description:'Three wide product panels with detailed descriptions.'},{id:'mixed',name:'Mixed layout',count:9,description:'A hero product opens each category, followed by nine-card grids.'},{id:'menu',name:'Restaurant menu',count:8,description:'Eight dishes with aligned prices and dietary notes.'},{id:'cafe',name:'Café menu',count:6,description:'Six dishes with small photos and generous spacing.'},{id:'comparison',name:'Comparison sheet',count:6,description:'Six products in a structured comparison table.'}] as const;
export const fonts=[{name:'Clean & practical',heading:'Roboto',body:'Open Sans'},{name:'Modern & bold',heading:'Montserrat',body:'Open Sans'},{name:'Elegant & editorial',heading:'Playfair Display',body:'Lato'},{name:'Friendly & contemporary',heading:'Poppins',body:'Open Sans'},{name:'Traditional & professional',heading:'Libre Baskerville',body:'Source Sans 3'}];
export const palettes=[{name:'Navy & teal',ink:'#17324D',paper:'#FFFFFF',accent:'#167D8D'},{name:'Forest & cream',ink:'#214E34',paper:'#FAF7EF',accent:'#B85C38'},{name:'Charcoal & gold',ink:'#202124',paper:'#FAF7F0',accent:'#B18A45'},{name:'Burgundy & blush',ink:'#752D43',paper:'#FFF9F2',accent:'#752D43'},{name:'Industrial orange',ink:'#252B33',paper:'#FFFFFF',accent:'#C75016'}];
export const extraPalettes=[{name:'Bistro red',ink:'#3B2523',paper:'#FFF8EE',accent:'#B32932'},{name:'Café terracotta',ink:'#392A20',paper:'#FCF3E4',accent:'#A84227'},{name:'Fresh citrus',ink:'#243A28',paper:'#FFFFF4',accent:'#4B701B'}];
export function getPalette(index:number){return index<5?palettes[index]:index>5?extraPalettes[index-6]:undefined;}
export const paletteOptions=[...palettes.map(p=>p.name),'Use my existing brand color',...extraPalettes.map(p=>p.name),'Recommend for my business'];
export type StyleAnswers=number[][];
export type CatalogStyle={template?:string;answers:StyleAnswers;layout:string;font:number;palette:number;format:'letter'|'a4';fields:string[]};
export const questions=[
 ['What type of business is this catalog for?',['Wholesale, distribution or grocery','Fashion, clothing or accessories','Beauty, wellness or personal care','Furniture or home décor','Electronics, tools, automotive or industrial','Another industry / mixed products','Restaurant, café or food service']],
 ['Who will mainly use your catalog?',['Retail shoppers','Businesses placing wholesale orders','Sales representatives','Professional buyers comparing specifications','A mixture of audiences']],
 ['What should your catalog help people do?',['Find products and place orders','Discover our brand and collections','Compare features and specifications','Explore promotions and offers','Browse our complete range']],
 ['How many products will it contain?',['1–20','21–100','101–500','More than 500','It changes frequently']],
 ['Which layout do you prefer?',layouts.map(l=>l.name)],
 ['What information must appear? Select all that apply.',['Product name and image','Item code and barcode','Price','Pack size and stock availability','Specifications / dimensions in the description','Description, benefits and contact details']],
 ['What photos do you have?',['High-resolution product photos','High-resolution lifestyle photos','Both product and lifestyle photos','Mostly small or older images','Some products have no images']],
 ['Which font style matches your brand?',[...fonts.map(f=>f.name+' — '+f.heading+' / '+f.body),'Choose for me']],
 ['Which color direction would you like?',paletteOptions],
 ['How will customers mainly view it?',['Printed Letter PDF','Printed A4 PDF','Computer or tablet','Phone / messaging / email','Both print and digital']]
] as const;
export function validStyle(s:any):s is CatalogStyle{return !!s&&(s.template===undefined||templates.some(t=>t.id===s.template))&&layouts.some(l=>l.id===s.layout)&&Number.isInteger(s.font)&&s.font>=0&&s.font<fonts.length&&Number.isInteger(s.palette)&&s.palette>=0&&s.palette<=8&&['letter','a4'].includes(s.format)&&Array.isArray(s.fields)&&s.fields.every((f:any)=>['image','sku','upc','price','pack','stock','description','brand','tags'].includes(f))&&Array.isArray(s.answers)&&s.answers.length===10&&s.answers.every((v:any,i:number)=>Array.isArray(v)&&v.length>0&&(i===5||v.length===1)&&v.every((n:any)=>Number.isInteger(n)&&n>=0&&n<questions[i][1].length));}
export function recommendStyles(answers:StyleAnswers):{label:string;reason:string;style:CatalogStyle}[]{
 const a=(i:number)=>answers[i]?.[0]??0;const fields=new Set<string>();
 for(const v of answers[5]||[])for(const f of [['image'],['sku','upc'],['price'],['pack','stock'],['description'],['description','brand']][v]||[])fields.add(f);
 const requested=layouts[a(4)]?.id||'balanced';
 const preferred=a(0)===6&&!['menu','cafe'].includes(requested)?'menu':requested==='wholesale'&&(a(6)===1||fields.has('description')&&a(2)===2)?'technical':a(9)===3&&['wholesale','balanced'].includes(requested)?'showcase':requested;
 const business=['wholesale','fashion','beauty','home','technical','mixed','restaurant'][a(0)];const audience=['shoppers','wholesale buyers','sales teams','professional buyers','mixed audiences'][a(1)];const volume=['a small collection','up to 100 products','a large collection','over 500 products','a changing range'][a(3)];
 if(a(0)===6){fields.add('price');fields.add('description');fields.add('tags');}
 const style:CatalogStyle={answers,layout:preferred,font:a(7)===5?([1,2,3].includes(a(0))?2:0):a(7),palette:a(8)===9?([0,2,3,1,4,0,6][a(0)]??0):a(8),format:a(9)===1?'a4':'letter',fields:[...fields]};
 return [{label:'Best match',reason:preferred!==requested?'Adjusted for your reading format or detailed content.':`Matches your ${business} catalog for ${audience}, with ${volume}.`,style},{label:'More visual',reason:'Larger images and fewer products on each page.',style:{...style,layout:a(0)===6?'cafe':preferred==='showcase'?'editorial':'showcase'}},{label:'More compact',reason:'A denser layout for browsing larger product ranges.',style:{...style,layout:a(0)===6?'menu':preferred==='wholesale'?'balanced':'wholesale'}}];
}

export const templates=[
 {id:'wholesale-classic',name:'Trade essentials',industry:0,layout:'wholesale',font:0,palette:0,description:'Compact ordering cards with a clear business hierarchy.'},
 {id:'retail-edit',name:'The retail edit',industry:0,layout:'balanced',font:1,palette:1,description:'A balanced selection with warm category openers.'},
 {id:'promo',name:'Seasonal highlights',industry:0,layout:'showcase',font:1,palette:6,description:'Four bold product features per page.'},
 {id:'fashion-editorial',name:'The lookbook',industry:1,layout:'editorial',font:2,palette:2,description:'A single statement image and product story per page.'},
 {id:'fashion-season',name:'Seasonal collection',industry:1,layout:'mixed',font:2,palette:3,description:'Hero collection openers followed by shopping grids.'},
 {id:'beauty',name:'Beauty ritual',industry:2,layout:'showcase',font:3,palette:3,description:'Spacious product photography and benefit descriptions.'},
 {id:'premium',name:'Signature collection',industry:2,layout:'editorial',font:2,palette:2,description:'Elegant typography with generous whitespace.'},
 {id:'interiors',name:'Rooms & objects',industry:3,layout:'mixed',font:4,palette:1,description:'Category stories followed by furniture collections.'},
 {id:'home-details',name:'Material details',industry:3,layout:'technical',font:4,palette:7,description:'Wide panels for dimensions and material descriptions.'},
 {id:'industrial',name:'Equipment guide',industry:4,layout:'technical',font:0,palette:4,description:'Practical product panels for technical information.'},
 {id:'comparison',name:'Compare & choose',industry:4,layout:'comparison',font:0,palette:0,description:'Compare item codes, descriptions, pack sizes and prices.'},
 {id:'restaurant-classic',name:'The bistro',industry:6,layout:'menu',font:4,palette:6,description:'Cream paper, red accents and aligned dish prices.'},
 {id:'cafe',name:'Coffee & company',industry:6,layout:'cafe',font:3,palette:7,description:'Warm colors, food photography and welcoming type.'},
 {id:'fresh',name:'Fresh kitchen',industry:6,layout:'cafe',font:1,palette:8,description:'Fresh greens, dishes and dietary notes.'},
 {id:'dining',name:'Evening menu',industry:6,layout:'menu',font:2,palette:2,description:'Elegant serif headings and restrained gold details.'}
];
export function templateStyle(id:string,base:CatalogStyle):CatalogStyle{const t=templates.find(t=>t.id===id);if(!t)return base;return {...base,template:id,layout:t.layout,font:t.font,palette:t.palette,fields:t.industry===6?['image','description','price','tags']:base.fields};}

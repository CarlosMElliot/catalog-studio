import type {Product} from './catalog.ts';
export const wholesaleLayouts=[
 {id:'weekly-featured',name:'Weekly Featured',count:6,description:'NEW · Landscape, six large panels, red prices and a navy footer.'},
 {id:'weekend-deals',name:'Weekend Deals',count:12,description:'NEW · Twelve offer cards with navy/gold branding and blue price labels.'},
 {id:'wholesale-range',name:'Wholesale Range',count:8,description:'NEW · Purple category panels and a clear ordering banner.'}
] as const;
export function isWholesaleLayout(id?:string){return wholesaleLayouts.some(l=>l.id===id);}
export function wholesaleTheme(id?:string){return id==='weekly-featured'?{paper:'#EC1024',ink:'#102C54',accent:'#D6081C',banner:'#D6081C',bannerInk:'#FFFFFF',card:'#F0F5F8'}:id==='weekend-deals'?{paper:'#EEF0F3',ink:'#16264E',accent:'#07538B',banner:'#10143D',bannerInk:'#F6D352',card:'#FFFFFF'}:{paper:'#32105B',ink:'#FFFFFF',accent:'#E8D6FF',banner:'#201A20',bannerInk:'#FFFFFF',card:'#452065'};}
export type Campaign={headline:string;startDate:string;endDate:string;terms:string;callToAction:string};
export type ProductPromotion={regularPrice:string;priceUnit:string;label:string};
export const blankCampaign=():Campaign=>({headline:'',startDate:'',endDate:'',terms:'',callToAction:''});
const date=(v:unknown)=>typeof v==='string'&&(v===''||(/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))));
export function validCampaign(c:any):c is Campaign{return !!c&&['headline','terms','callToAction'].every(k=>typeof c[k]==='string'&&c[k].length<=140)&&date(c.startDate)&&date(c.endDate)&&(!c.startDate||!c.endDate||c.startDate<=c.endDate);}
export function validPromotion(p:any):p is ProductPromotion{return !!p&&typeof p.regularPrice==='string'&&(p.regularPrice===''||/^\d+(\.\d{1,2})?$/.test(p.regularPrice))&&typeof p.priceUnit==='string'&&p.priceUnit.length<=30&&typeof p.label==='string'&&p.label.length<=50;}
export function offerDates(c?:Campaign){if(!c)return '';return c.startDate&&c.endDate?`${c.startDate} — ${c.endDate}`:c.startDate?`From ${c.startDate}`:c.endDate?`Until ${c.endDate}`:'';}
export function rangePagePlan(products:Product[],cover:boolean,index:boolean){
 const grouped=new Map<string,Product[]>();for(const p of products){if(!grouped.has(p.category))grouped.set(p.category,[]);grouped.get(p.category)!.push(p);}
 const panels:{category:string;products:Product[]}[]=[];for(const [category,items]of grouped)for(let i=0;i<items.length;i+=4)panels.push({category,products:items.slice(i,i+4)});
 const indexPages=index?Math.ceil(grouped.size/24):0,offset=Number(cover)+indexPages;
 const pages:{category:string;products:Product[];panels:typeof panels;hero?:boolean}[]=[];for(let i=0;i<panels.length;i+=2){const slice=panels.slice(i,i+2);pages.push({category:slice.map(p=>p.category).join(' · '),products:slice.flatMap(p=>p.products),panels:slice});}
 const entries=[...grouped].map(([category,items])=>({category,count:items.length,page:offset+1+pages.findIndex(p=>p.panels.some(p=>p.category===category))}));return {entries,pages,indexPages,total:offset+pages.length};
}

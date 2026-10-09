import type {Product} from './catalog.ts';
export type CatalogSection={id:string;kind:'introduction'|'notes'|'ordering'|'contact'|'featured';title:string;body:string;position:'before'|'after';productId?:string};
export type CatalogDocument={sections:CatalogSection[];dividers:boolean;cover:boolean;contents:boolean};
export const emptyDocument=():CatalogDocument=>({sections:[],dividers:false,cover:true,contents:true});
export function validDocument(d:any):d is CatalogDocument{return !!d&&['dividers','cover','contents'].every(k=>typeof d[k]==='boolean')&&Array.isArray(d.sections)&&d.sections.length<=40&&new Set(d.sections.map((s:any)=>s?.id)).size===d.sections.length&&d.sections.every((s:any)=>s&&typeof s.id==='string'&&typeof s.title==='string'&&s.title.length<=100&&typeof s.body==='string'&&s.body.length<=1800&&['introduction','notes','ordering','contact','featured'].includes(s.kind)&&['before','after'].includes(s.position)&&(s.productId===undefined||typeof s.productId==='string'));}
export type DocumentPage={kind:'cover'|'contents'|'section'|'divider'|'products';title:string;products?:Product[];hero?:boolean;section?:CatalogSection;number:number};
export function documentPlan(products:Product[],perPage:number,cover:boolean,contents:boolean,mixed=false,document:CatalogDocument=emptyDocument()){
 if(!Number.isInteger(perPage)||perPage<1)throw Error('Choose a valid product layout.');
 const groups=new Map<string,Product[]>();for(const p of products){if(!groups.has(p.category))groups.set(p.category,[]);groups.get(p.category)!.push(p);}
 const content:Omit<DocumentPage,'number'>[]=[];
 const addSections=(position:string)=>{for(const section of document.sections.filter(s=>s.position===position))content.push({kind:'section',title:section.title,section});};
 addSections('before');
 for(const [title,items] of groups){if(document.dividers)content.push({kind:'divider',title});for(let i=0;i<items.length;){const hero=mixed&&i===0,count=hero?1:perPage;content.push({kind:'products',title,products:items.slice(i,i+count),hero});i+=count;}}
 addSections('after');
 const entries:{title:string;page:number}[]=[];const seen=new Set<string>();
 for(let i=0;i<content.length;i++){const p=content[i];if(p.kind==='section'||!seen.has(p.title)){entries.push({title:p.title,page:i});}if(p.kind!=='section')seen.add(p.title);}
 const indexPages=contents?Math.ceil(entries.length/24):0,offset=Number(cover)+indexPages;
 for(const e of entries)e.page+=offset+1;
 const pages:DocumentPage[]=[];if(cover)pages.push({kind:'cover',title:'Cover',number:1});for(let i=0;i<indexPages;i++)pages.push({kind:'contents',title:'Table of contents',number:pages.length+1});for(const p of content)pages.push({...p,number:pages.length+1});
 return {pages,entries,indexPages,total:pages.length};
}

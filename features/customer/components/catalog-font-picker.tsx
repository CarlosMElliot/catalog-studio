'use client';
import {useEffect,useState} from 'react';
import {fonts,recommendedFont,type CatalogStyle} from '@/lib/catalog-style';
function FontChoice({font,index,selected,onSelect,automatic=false}:{font:typeof fonts[number];index:string;selected:boolean;onSelect:()=>void;automatic?:boolean}){
 const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
 useEffect(()=>{let active=true;setStatus('loading');Promise.all([document.fonts.load(`400 24px "${font.heading}"`),document.fonts.load(`700 24px "${font.heading}"`),document.fonts.load(`400 14px "${font.body}"`)]).then(faces=>{if(active)setStatus(faces.every(f=>f.length>0)?'ready':'error');}).catch(()=>{if(active)setStatus('error');});return()=>{active=false;};},[font.heading,font.body]);
 return <label className={'catalog-font-choice'+(selected?' selected':'')}>
 <span className="catalog-font-choice-top"><input type="radio" name="catalog-font-pairing" value={index} checked={selected} disabled={status!=='ready'} onChange={onSelect}/><span>{automatic?'Automatic · recommended for this design':font.name}</span>{selected&&<strong>Selected</strong>}</span>
 {status==='ready'?<><span className="catalog-font-heading" style={{fontFamily:`'${font.heading}',serif`}}>{font.heading}</span><span className="catalog-font-example" style={{fontFamily:`'${font.heading}',serif`}}>Your collection, beautifully presented</span><span className="catalog-font-body" style={{fontFamily:`'${font.body}',sans-serif`}}>Product details · Café · Niño · $24.95 · 0123456789</span><span className="catalog-font-caption">Headings: {font.heading} · Details: {font.body}</span></>:<span className="catalog-font-loading" role="status">{status==='loading'?'Loading actual font preview…':'Font preview unavailable. Check your connection and reopen font settings.'}</span>}
 </label>;
}
export default function CatalogFontPicker({style,onChange}:{style:CatalogStyle;onChange:(patch:Partial<CatalogStyle>)=>void}){
 const recommended=recommendedFont(style.answers[0]?.[0]??5,style.layout);
 return <fieldset className="catalog-font-picker"><legend>Choose your fonts</legend><p className="help">Each card shows the actual heading and detail fonts. Select a card to apply the pair to your catalog.</p><div className="catalog-font-grid"><FontChoice font={fonts[recommended]} index="auto" automatic selected={style.fontMode==='auto'} onSelect={()=>onChange({fontMode:'auto',font:recommended})}/>{fonts.map((font,index)=><FontChoice key={font.name} font={font} index={String(index)} selected={style.fontMode!=='auto'&&style.font===index} onSelect={()=>onChange({fontMode:'manual',font:index})}/>)}</div><p className="help">Automatic follows your business and design. A manually selected pair stays selected when you switch designs.</p></fieldset>;
}

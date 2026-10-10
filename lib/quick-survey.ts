import {businessLayouts,expandedAnswers,layouts,recommendStyles,type CatalogStyle} from './catalog-style.ts';
export const quickQuestions=['What type of business is this for?','What will this catalog help customers do?','Which design do you like?','What details should appear?','Would you like barcodes?'];
export function quickDefaults(existing?:CatalogStyle):CatalogStyle{
 if(existing)return {...existing,answers:expandedAnswers(existing),fields:[...existing.fields]};
 const answers=[[0],[1],[0],[1],[layouts.findIndex(l=>l.id==='wholesale-range')],[0,1,2,3],[0],[5],[0],[0],[0],[0],[1],[0],[0],[0],[1],[0],[0],[0]];
 return recommendStyles(answers)[0].style;
}
export function quickBusiness(style:CatalogStyle,business:number){const answers=style.answers.map(a=>[...a]);answers[0]=[business];const layout=businessLayouts(business,answers[2]?.[0]??0)[0];answers[4]=[layouts.findIndex(l=>l.id===layout)];const font=[1,2,3].includes(business)?2:business===6?3:0;return {...style,answers,layout,font};}
export function quickPurpose(style:CatalogStyle,purpose:number){const answers=style.answers.map(a=>[...a]);answers[2]=[purpose];return {...style,answers};}
export function quickLayout(style:CatalogStyle,layout:string){const answers=style.answers.map(a=>[...a]);answers[4]=[layouts.findIndex(l=>l.id===layout)];return {...style,answers,layout};}
export function quickBarcode(style:CatalogStyle,source:'upc'|'sku'|'none'):CatalogStyle{return {...style,barcodeSource:source,fields:source==='none'?style.fields.filter(f=>f!=='upc'):[...new Set([...style.fields,'upc'])]};}

export const themes=[
 {id:'sage',name:'Original Sage',description:'Soft and natural',colors:['#f8f9f6','#ffffff','#235b49']},
 {id:'navy-teal',name:'Navy & Teal',description:'Clean and professional',colors:['#f4f7fa','#14263d','#087f8c']},
 {id:'charcoal-amber',name:'Charcoal & Amber',description:'Bold and practical',colors:['#faf8f5','#252525','#995b00']},
 {id:'indigo-slate',name:'Indigo & Slate',description:'Modern and focused',colors:['#f7f8fc','#243047','#4f46e5']},
 {id:'burgundy-cream',name:'Burgundy & Cream',description:'Warm and editorial',colors:['#faf6f0','#612b3a','#8b5d24']},
 {id:'ocean-blue',name:'Ocean Blue',description:'Bright and familiar',colors:['#f2f7fc','#123454','#1769c2']},
 {id:'midnight-mint',name:'Midnight & Mint',description:'A comfortable dark theme',colors:['#101a23','#192733','#73d9b1']},
] as const;
export type ThemeId=typeof themes[number]['id'];
export function validTheme(value:unknown):ThemeId{return themes.some(t=>t.id===value)?value as ThemeId:'sage';}

export const PLANS = [
 {id:'starter',name:'Starter',price:40,bytes:500_000_000,storage:'500 MB',description:'A focused home for your first collections.'},
 {id:'essential',name:'Essential',price:60,bytes:1_000_000_000,storage:'1 GB',description:'Room for a growing product library.'},
 {id:'professional',name:'Professional',price:80,bytes:2_000_000_000,storage:'2 GB',description:'More collections. More possibilities.'},
 {id:'business',name:'Business',price:160,bytes:10_000_000_000,storage:'10 GB',description:'Built for your largest image libraries.'}
] as const;
export const planById=(id:string)=>PLANS.find(p=>p.id===id);
export const bytesLabel=(n:number)=>n>=1e9?`${(n/1e9).toFixed(2)} GB`:`${(n/1e6).toFixed(1)} MB`;
export type Account={id:string;email:string;name:string;plan:string;status:string;quota_bytes:number;used_bytes:number;created_at:string;is_owner:number;monthly_price_cents:number|null};

export function accountPlanName(a:Pick<Account,'plan'>){return a.plan==='custom'?'Custom':planById(a.plan)?.name||'Unknown plan';}
export function accountMonthlyPrice(a:Pick<Account,'plan'|'monthly_price_cents'>){return a.plan==='custom'?(a.monthly_price_cents??0)/100:planById(a.plan)?.price??0;}
/** Only server-validated assignments may update account quotas and prices. */
export function resolvePlanAssignment(id:unknown,storageGb:unknown,monthlyPrice:unknown){
 const fixed=typeof id==='string'?planById(id):undefined;
 if(fixed)return {id:fixed.id,bytes:fixed.bytes,priceCents:null};
 if(id!=='custom')throw Error('Choose a valid plan.');
 const decimal=(value:unknown)=>typeof value==='string'||typeof value==='number'?String(value).trim():'';
 const gbText=decimal(storageGb),priceText=decimal(monthlyPrice);
 if(!/^\d+(\.\d{1,2})?$/.test(gbText)||!/^\d+(\.\d{1,2})?$/.test(priceText))throw Error('Enter storage GB and monthly USD price using at most two decimal places.');
 const gb=Number(gbText),price=Number(priceText);
 if(gb<0.01||gb>1_000_000||price<0||price>1_000_000)throw Error('Storage must be 0.01–1,000,000 GB; monthly price must be $0–$1,000,000.');
 return {id:'custom',bytes:Math.round(gb*1_000_000_000),priceCents:Math.round(price*100)};
}

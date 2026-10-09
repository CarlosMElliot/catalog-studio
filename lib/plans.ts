export const PLANS = [
 {id:'starter',name:'Starter',price:40,bytes:500_000_000,storage:'500 MB',description:'A focused home for your first collections.'},
 {id:'essential',name:'Essential',price:60,bytes:1_000_000_000,storage:'1 GB',description:'Room for a growing product library.'},
 {id:'professional',name:'Professional',price:80,bytes:2_000_000_000,storage:'2 GB',description:'More collections. More possibilities.'},
 {id:'business',name:'Business',price:160,bytes:10_000_000_000,storage:'10 GB',description:'Built for your largest image libraries.'}
] as const;
export const planById=(id:string)=>PLANS.find(p=>p.id===id);
export const bytesLabel=(n:number)=>n>=1e9?`${(n/1e9).toFixed(2)} GB`:`${(n/1e6).toFixed(1)} MB`;
export type Account={id:string;email:string;name:string;plan:string;status:string;quota_bytes:number;used_bytes:number;created_at:string;is_owner:number};

import {isFounderEmail} from '@/lib/auth/access-policy';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {Account,PLANS} from '../plans';
export class ApiError extends Error {constructor(public status:number,message:string){super(message);}}
export function database(){if(!env.DB)throw new ApiError(503,'Account database unavailable');return env.DB;}
export function bucket(){if(!env.BUCKET)throw new ApiError(503,'Image storage unavailable');return env.BUCKET;}
export async function identity(){const u=await getChatGPTUser();if(!u)throw new ApiError(401,'Sign in to continue');return u;}
export async function admin(){const u=await identity();if(!isFounderEmail(u.email,env.CATALOG_ADMIN_EMAIL))throw new ApiError(403,'Administrator access required');return u;}
export async function account(){
 const u=await identity(),db=database(),email=u.email.trim().toLowerCase();
 const owner=isFounderEmail(email,env.CATALOG_ADMIN_EMAIL);
 if(owner)await db.prepare('INSERT OR IGNORE INTO accounts (id,email,name,user_id,plan,status,quota_bytes,is_owner,created_at) VALUES (?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),email,u.fullName||'Workspace owner',u.userId,'business','active',PLANS[3].bytes,1,new Date().toISOString()).run();
 let a=await db.prepare('SELECT a.*, COALESCE((SELECT SUM(bytes) FROM media WHERE account_id=a.id),0) used_bytes FROM accounts a WHERE email=?').bind(email).first<Account&{user_id:string|null}>();
 if(!a)throw new ApiError(403,'Your account has not been added. Ask the administrator to create your account.');
 if(a.user_id&&a.user_id!==u.userId)throw new ApiError(403,'Account identity does not match');
 if(!a.user_id){await db.prepare('UPDATE accounts SET user_id=? WHERE id=? AND user_id IS NULL').bind(u.userId,a.id).run();a=await db.prepare('SELECT a.*, COALESCE((SELECT SUM(bytes) FROM media WHERE account_id=a.id),0) used_bytes FROM accounts a WHERE id=?').bind(a.id).first<typeof a>();if(!a||a.user_id!==u.userId)throw new ApiError(403,'Account identity does not match');}
 return a;
}
export function writable(a:Account){if(!['active','trial'].includes(a.status))throw new ApiError(403,'This account is paused. Contact your administrator to enable uploads and changes.');}
export function sameOrigin(req:Request){if(req.headers.get('origin')!==new URL(req.url).origin)throw new ApiError(403,'Same-origin request required');}
export function failure(e:unknown){return Response.json({error:e instanceof ApiError?e.message:'The request could not be completed. Please try again.'},{status:e instanceof ApiError?e.status:500});}
export async function limitedBody(req:Request,max:number){if(Number(req.headers.get('content-length'))>max)throw new ApiError(413,'File is too large');const reader=req.body?.getReader();if(!reader)return new Uint8Array();const chunks:Uint8Array[]=[];let size=0;for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new ApiError(413,'File is too large');}chunks.push(value);}const out=new Uint8Array(size);let n=0;for(const c of chunks){out.set(c,n);n+=c.length;}return out;}

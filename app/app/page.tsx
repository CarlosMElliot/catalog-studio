import CatalogApp from '@/features/customer/components/catalog-app';
import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {account} from '@/lib/server/account';
export const metadata={title:'Customer App | Catalog Studio'};
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/app');try{const a=await account();return <CatalogApp accountId={a.id} owner={!!a.is_owner}/>;}catch(e){return <main className="access-panel"><p className="eyebrow">CATALOG STUDIO</p><h1>Your workspace is not available yet.</h1><p>{e instanceof Error?e.message:'Please contact the administrator.'}</p><a className="btn" href="/plans">View plans</a></main>;}}

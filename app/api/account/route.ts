import {account,failure} from '@/lib/server/account';
export async function GET(){try{const a=await account();return Response.json({account:a,billingConnected:false},{headers:{'Cache-Control':'no-store'}});}catch(e){return failure(e);}}

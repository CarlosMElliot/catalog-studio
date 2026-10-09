import {readFileSync,writeFileSync,mkdirSync,readdirSync,existsSync} from 'node:fs';
import {resolve,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const publicRoot=resolve(root,'public')+sep;
const bundles=resolve(root,'source-assets');
let restored=0;
for(const bundle of readdirSync(bundles).filter(n=>/^images-\d+\.json$/.test(n)).sort()){
 for(const asset of JSON.parse(readFileSync(resolve(bundles,bundle),'utf8'))){
  const target=resolve(root,asset.path);
  if(!target.startsWith(publicRoot))throw Error('Invalid bundled asset path');
  const bytes=Buffer.from(asset.content,'base64');
  const hash=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
  if(hash!==asset.sha)throw Error('Bundled image checksum mismatch: '+asset.path);
  if(existsSync(target)&&readFileSync(target).equals(bytes))continue;
  mkdirSync(dirname(target),{recursive:true});writeFileSync(target,bytes);restored++;
 }
}
if(restored)console.log('Restored '+restored+' bundled catalog images.');

import {env} from 'cloudflare:workers';
import {redirect} from 'next/navigation';
import {BookOpen,ShieldCheck,ArrowUpRight} from 'lucide-react';
import {requireChatGPTUser,chatGPTSignOutPath} from './chatgpt-auth';
import {isFounderEmail} from '@/lib/auth/access-policy';

export const dynamic = 'force-dynamic';
export const metadata = {title: 'Choose Your Workspace | Catalog Studio'};

export default async function WorkspaceChooser() {
  const user = await requireChatGPTUser('/');
  if (!isFounderEmail(user.email, env.CATALOG_ADMIN_EMAIL)) redirect('/app');

  return <main className="workspace-chooser">
    <header><a href="/" className="chooser-brand"><BookOpen size={25}/>catalog<span>studio</span></a><a className="btn" href={chatGPTSignOutPath('/')}>Sign out</a></header>
    <section className="chooser-intro"><p className="eyebrow">YOUR FOUNDER WORKSPACE</p><h1>Two spaces.<br/>One clear purpose for each.</h1><p>Manage your business or build your next catalog.<br/>Choose where you want to work today.</p></section>
    <div className="workspace-choices">
      <a href="/admin" className="workspace-choice founder-choice"><div className="choice-icon"><ShieldCheck size={28}/></div><span className="choice-badge">FOUNDER ONLY</span><h2>Admin dashboard</h2><p>Your private control center for customer accounts, plan assignments, access and storage limits.</p><ul><li>Create and manage users</li><li>Assign plans and suspend access</li><li>Monitor storage across accounts</li></ul><strong>Open founder console <ArrowUpRight size={19}/></strong></a>
      <a href="/app" className="workspace-choice"><div className="choice-icon"><BookOpen size={28}/></div><span className="choice-badge">CUSTOMER EXPERIENCE</span><h2>Catalog application</h2><p>Your own product workspace, with the same catalog tools your customers use.</p><ul><li>Import and organize products</li><li>Manage images and branding</li><li>Export catalogs and backups</li></ul><strong>Open customer app <ArrowUpRight size={19}/></strong></a>
    </div>
    <footer><ShieldCheck size={16}/><span>Only your founder account sees this chooser. Customers open their own workspace directly.</span></footer>
  </main>;
}

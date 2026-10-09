import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {admin} from '@/lib/server/account';

export const dynamic = 'force-dynamic';
export const metadata = {title: 'Founder Admin | Catalog Studio'};

/** Every page nested under /admin inherits this server-side founder guard. */
export default async function FounderLayout({children}: {children: React.ReactNode}) {
  await requireChatGPTUser('/admin');
  try {
    await admin();
  } catch {
    return <main className="access-panel">
      <p className="eyebrow">FOUNDER CONSOLE</p>
      <h1>This area is for the founder.</h1>
      <p>Your account does not have administrative access. You can continue in your customer workspace.</p>
      <a href="/app" className="btn">Open customer app</a>
    </main>;
  }
  return children;
}

import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'Nova Catalog Studio',description:'Your products, beautifully presented. Import, curate, and publish branded PDF catalogs.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}

import {CheckCircle2,Loader2} from 'lucide-react';
import type {PdfProgress} from '@/lib/pdf-progress';
export default function PdfExportProgress({progress}:{progress:PdfProgress}){
 const finished=progress.phase==='complete',failed=progress.phase==='error',cancelled=progress.phase==='cancelled';
 return <section className={'pdf-progress '+(failed?'pdf-progress-error':'')} aria-label="PDF generation progress">
  <div className="pdf-progress-heading"><strong>{finished?<CheckCircle2 size={17}/>:!failed&&!cancelled?<Loader2 size={17} className="spin"/>:null}{finished?'PDF generated':failed?'Generation interrupted':cancelled?'Export cancelled':'Generating your PDF'}</strong><span>{progress.percent}%</span></div>
  <progress max={100} value={progress.percent} aria-label="PDF generation" aria-valuetext={`${progress.percent} percent. ${progress.message}`}/>
  <p role={failed?'alert':'status'} aria-live="polite">{progress.message}</p>
  {progress.totalPages>0&&<small>{progress.completedPages} of {progress.totalPages} pages generated</small>}
  {finished?<p className="pdf-friendly-note">Your download has been requested. Check your browser’s downloads or save dialog.</p>:failed||cancelled?<p className="pdf-friendly-note">You can try again or adjust your export options. Your saved catalog is still there.</p>:<div className="pdf-friendly-note"><p><strong>Please keep this window open and don’t refresh.</strong> Your PDF is being created in this browser. Closing or refreshing will stop it, and you’ll need to start the export again.</p><p>We’re preparing high-resolution images and arranging each page for a sharper PDF. Catalogs with lots of products or photos can take a few minutes, depending on your device. You can cancel below; we’ll stop once the current page finishes. During the final download step, cancellation is no longer available.</p></div>}
 </section>;
}

import {CheckCircle2,Loader2} from 'lucide-react';
import type {PdfProgress} from '@/lib/pdf-progress';
export default function PdfExportProgress({progress}:{progress:PdfProgress}){
 const finished=progress.phase==='complete',failed=progress.phase==='error';
 return <section className={'pdf-progress '+(failed?'pdf-progress-error':'')} aria-label="PDF generation progress">
  <div className="pdf-progress-heading"><strong>{finished?<CheckCircle2 size={17}/>:!failed?<Loader2 size={17} className="spin"/>:null}{finished?'PDF generated':failed?'Generation interrupted':'Generating your PDF'}</strong><span>{progress.percent}%</span></div>
  <progress max={100} value={progress.percent} aria-label="PDF generation" aria-valuetext={`${progress.percent} percent. ${progress.message}`}/>
  <p role={failed?'alert':'status'} aria-live="polite">{progress.message}</p>
  {progress.totalPages>0&&<small>{progress.completedPages} of {progress.totalPages} pages generated</small>}
  <small>{finished?'Download requested. Check your browser downloads or save dialog.':failed?'Adjust the export options if needed, then try again.':'Keep this window open. Large catalogs can take several minutes.'}</small>
 </section>;
}

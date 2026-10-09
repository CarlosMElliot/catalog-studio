export type PdfProgress={phase:'preparing'|'rendering'|'saving'|'complete'|'error';percent:number;message:string;completedPages:number;totalPages:number};
/** Page work occupies 5–95%; final serialization/download handoff finishes the job. */
export function pdfPageProgress(completedPages:number,totalPages:number,message:string):PdfProgress{
 const total=Math.max(0,totalPages),completed=Math.max(0,Math.min(completedPages,total));
 return {phase:'rendering',percent:total?5+Math.floor(completed/total*90):5,message,completedPages:completed,totalPages:total};
}

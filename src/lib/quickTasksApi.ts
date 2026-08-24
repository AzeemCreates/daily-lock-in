import type {QuickTaskKey} from './domain';
export type QuickTaskCompletions=Partial<Record<QuickTaskKey,string>>;
const TOKEN=import.meta.env.VITE_WIDGET_TOKEN as string|undefined;
async function call(body:{date:string;task?:QuickTaskKey;action?:'complete'|'undo'}):Promise<QuickTaskCompletions>{
  const method=body.task?'POST':'GET';
  const url=method==='GET'?`/api/tasks?date=${encodeURIComponent(body.date)}&token=${encodeURIComponent(TOKEN||'')}`:'/api/tasks';
  const res=await fetch(url,method==='GET'?undefined:{method,headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,token:TOKEN})});
  if(!res.ok)throw new Error(`Quick task sync failed (${res.status})`);
  const data=await res.json();
  return data.completions as QuickTaskCompletions;
}
export const fetchQuickTasks=(date:string)=>call({date});
export const completeQuickTask=(date:string,task:QuickTaskKey)=>call({date,task,action:'complete'});
export const undoQuickTask=(date:string,task:QuickTaskKey)=>call({date,task,action:'undo'});

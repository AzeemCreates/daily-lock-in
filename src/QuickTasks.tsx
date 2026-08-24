import {useCallback,useEffect,useRef,useState}from'react';
import{Check,Zap}from'lucide-react';
import{quickTasks,type QuickTaskKey}from'./lib/domain';
import{completeQuickTask,fetchQuickTasks,undoQuickTask,type QuickTaskCompletions}from'./lib/quickTasksApi';
const fmtTime=(v:string)=>new Date(v).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
export default function QuickTasks({date}:{date:string}){
  const[completions,setCompletions]=useState<QuickTaskCompletions>({});
  const[synced,setSynced]=useState(false);
  const[error,setError]=useState('');
  const pending=useRef(new Set<QuickTaskKey>());
  const refresh=useCallback(async()=>{
    try{const data=await fetchQuickTasks(date);setCompletions(data);setSynced(true);setError('')}
    catch{setError('Widget sync unavailable — showing local state only')}
  },[date]);
  useEffect(()=>{const kick=window.setTimeout(refresh,0);const poll=window.setInterval(refresh,20000);const onVisible=()=>document.visibilityState==='visible'&&refresh();document.addEventListener('visibilitychange',onVisible);window.addEventListener('focus',refresh);return()=>{window.clearTimeout(kick);window.clearInterval(poll);document.removeEventListener('visibilitychange',onVisible);window.removeEventListener('focus',refresh)}},[refresh]);
  const toggle=useCallback(async(key:QuickTaskKey)=>{
    if(pending.current.has(key))return;
    pending.current.add(key);
    const wasDone=!!completions[key];
    setCompletions(c=>({...c,[key]:wasDone?undefined:new Date().toISOString()}));
    try{const data=wasDone?await undoQuickTask(date,key):await completeQuickTask(date,key);setCompletions(data);setError('')}
    catch{setCompletions(c=>({...c,[key]:wasDone?new Date().toISOString():undefined}));setError('Could not reach the server — try again')}
    finally{pending.current.delete(key)}
  },[completions,date]);
  return <section className="panel quicktasks"><div className="section-head"><div><span className="eyebrow">{synced?'WIDGET SYNCED':'CONNECTING'}</span><h2>Quick Tasks</h2></div>{error&&<small className="edited">{error}</small>}</div>
    <div className="quicktask-grid">{quickTasks.map(t=>{const at=completions[t.key];return <button key={t.key} className={`quicktask ${at?'done':''}`} onClick={()=>toggle(t.key)}><span className="quicktask-icon">{at?<Check/>:<Zap/>}</span><strong>{t.label}</strong>{at&&<small>{fmtTime(at)}</small>}</button>})}</div>
  </section>;
}

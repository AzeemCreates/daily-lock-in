import type{VercelRequest,VercelResponse}from'@vercel/node';
import{neon}from'@neondatabase/serverless';

const sql=neon(process.env.DATABASE_URL!);
const TASK_KEYS=new Set(['far_1000x','pushups_125','deep_work_90','study','read_25_pages','algorithm','skill_stack','habit_stack','shower_task']);
const DATE_RE=/^\d{4}-\d{2}-\d{2}$/;

let tableReady:Promise<unknown>|null=null;
function ensureTable(){
  if(!tableReady)tableReady=sql`CREATE TABLE IF NOT EXISTS quick_task_completions(task_date date NOT NULL,task_key text NOT NULL,completed_at timestamptz NOT NULL,PRIMARY KEY(task_date,task_key))`.catch(err=>{tableReady=null;throw err});
  return tableReady;
}

async function readCompletions(date:string){
  const rows=await sql`SELECT task_key,completed_at FROM quick_task_completions WHERE task_date=${date}`;
  const out:Record<string,string>={};
  for(const row of rows as {task_key:string;completed_at:string}[])out[row.task_key]=new Date(row.completed_at).toISOString();
  return out;
}

type Body={date?:string;task?:string;action?:string;token?:string};

export default async function handler(req:VercelRequest,res:VercelResponse){
  const method=(req.method||'GET').toUpperCase();
  let body:Body={};
  if(method==='POST'){
    try{body=(req.body as Body)||{}}
    catch(err){
      console.error('Body parse failed. content-type:',req.headers['content-type'],'error:',err);
      res.status(400).json({error:'Invalid request body',contentType:req.headers['content-type']||null});
      return;
    }
  }
  const token=method==='GET'?(req.query.token as string|undefined):body.token;
  if(!process.env.WIDGET_TOKEN||token!==process.env.WIDGET_TOKEN){
    console.error('Unauthorized. received len:',token?.length??0,'expected len:',process.env.WIDGET_TOKEN?.length??0);
    res.status(401).json({error:'Unauthorized'});
    return;
  }

  if(method==='GET'){
    const date=req.query.date as string|undefined;
    if(!date||!DATE_RE.test(date)){res.status(400).json({error:'date must be YYYY-MM-DD'});return}
    await ensureTable();
    res.status(200).json({date,completions:await readCompletions(date)});
    return;
  }

  if(method==='POST'){
    const{date,task,action}=body;
    if(!date||!DATE_RE.test(date)){res.status(400).json({error:'date must be YYYY-MM-DD'});return}
    if(!task||!TASK_KEYS.has(task)){res.status(400).json({error:'unknown task'});return}
    await ensureTable();
    if(action==='undo'){
      await sql`DELETE FROM quick_task_completions WHERE task_date=${date} AND task_key=${task}`;
    }else{
      await sql`INSERT INTO quick_task_completions(task_date,task_key,completed_at) VALUES(${date},${task},now()) ON CONFLICT(task_date,task_key) DO NOTHING`;
    }
    res.status(200).json({date,completions:await readCompletions(date)});
    return;
  }

  res.status(405).json({error:'Method not allowed'});
}

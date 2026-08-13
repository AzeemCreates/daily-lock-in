import {z} from 'zod';import {defaultSettings,type AppSettings,type DailyRecord} from './domain';
export interface AppState{schemaVersion:1;records:Record<string,DailyRecord>;settings:AppSettings}
const record=z.object({localDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),showers:z.array(z.string()).max(2),workoutAt:z.string().nullable(),changedClothesAt:z.string().nullable(),environmentResetAt:z.string().nullable(),lockInAt:z.string().nullable(),editedAt:z.string().nullable()});
const settings=z.object({schemaVersion:z.literal(1),weekStartsOn:z.union([z.literal(0),z.literal(1)]),workoutRestDay:z.number().int().min(0).max(6),accentColor:z.string(),rewardColor:z.string(),dangerColor:z.string(),microphoneEnabled:z.boolean(),reducedMotion:z.boolean(),storeVoiceTranscripts:z.boolean(),labels:z.object({workout:z.string(),showers:z.string(),lockIn:z.string()})});
const schema=z.object({schemaVersion:z.literal(1),records:z.record(z.string(),record),settings});const KEY='daily-lock-in-v1';
export const defaultState=():AppState=>({schemaVersion:1,records:{},settings:structuredClone(defaultSettings)});
export function loadState():AppState{try{const raw=localStorage.getItem(KEY);return raw?schema.parse(JSON.parse(raw)):defaultState()}catch{return defaultState()}}
export const saveState=(s:AppState)=>localStorage.setItem(KEY,JSON.stringify(schema.parse(s)));
export const exportState=(s:AppState)=>JSON.stringify(schema.parse(s),null,2);
export const importState=(text:string)=>schema.parse(JSON.parse(text));
export const clearState=()=>localStorage.removeItem(KEY);
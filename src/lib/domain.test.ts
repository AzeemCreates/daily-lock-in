import { describe, expect, it } from 'vitest';
import { canLockIn, getDayStatus, isWorkoutRequired, completeAction, overallProgress, type DailyRecord, defaultSettings } from './domain';
const empty=(date='2026-08-12'):DailyRecord=>({localDate:date,showers:[],workoutAt:null,changedClothesAt:null,environmentResetAt:null,lockInAt:null,editedAt:null});
describe('habit rules',()=>{
 it('requires workouts on six days and exempts the rest day',()=>{expect(isWorkoutRequired('2026-08-09',0)).toBe(false);expect(isWorkoutRequired('2026-08-10',0)).toBe(true)});
 it('requires shower, clothes, and environment before lock in',()=>{const r=empty();expect(canLockIn(r)).toBe(false);r.showers=['2026-08-12T08:00:00'];r.changedClothesAt='x';r.environmentResetAt='x';expect(canLockIn(r)).toBe(true)});
 it('refuses a lock in write when prerequisites are missing',()=>expect(()=>completeAction(empty(),'lock_in','x')).toThrow(/prerequisites/i));
 it('counts at most two showers',()=>{let r=empty();r=completeAction(r,'shower','a');r=completeAction(r,'shower','b');r=completeAction(r,'shower','c');expect(r.showers).toEqual(['a','b'])});
 it('never marks future or current dates missed',()=>{expect(getDayStatus(empty('2026-08-13'),'2026-08-12',defaultSettings)).toBe('future');expect(getDayStatus(empty(),'2026-08-12',defaultSettings)).toBe('progress')});
 it('marks partial past days partial and fully completed days complete',()=>{const partial={...empty('2026-08-11'),showers:['a']};expect(getDayStatus(partial,'2026-08-12',defaultSettings)).toBe('partial');const full={...partial,showers:['a','b'],workoutAt:'x',changedClothesAt:'x',environmentResetAt:'x',lockInAt:'x'};expect(getDayStatus(full,'2026-08-12',defaultSettings)).toBe('complete')});
 it('calculates a fully completed workout day at 100 percent',()=>{const full={...empty(),showers:['a','b'],workoutAt:'x',changedClothesAt:'x',environmentResetAt:'x',lockInAt:'x'};expect(overallProgress(full,defaultSettings)).toBe(100)});
});
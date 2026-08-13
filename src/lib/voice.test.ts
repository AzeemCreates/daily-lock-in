import {describe,expect,it} from 'vitest';
import {parseVoiceIntent} from './voice';
describe('voice intent parser',()=>{
 it.each([['workout done','workout'],['I finished my workout','workout'],['first shower done','shower'],['I changed clothes','clothes'],['desk is clean','environment'],['lock me in','lock_in']])('maps %s to %s',(text,action)=>expect(parseVoiceIntent(text).action).toBe(action));
 it('requires confirmation for undo',()=>expect(parseVoiceIntent('undo workout')).toMatchObject({action:'undo_workout',needsConfirmation:true}));
 it('does not guess unknown input',()=>expect(parseVoiceIntent('maybe something happened')).toMatchObject({action:'unknown',needsConfirmation:true}));
});
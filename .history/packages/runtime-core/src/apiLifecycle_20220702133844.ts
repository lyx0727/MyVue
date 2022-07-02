import { currentInstance } from "./component";

export const enum LifecycleHooks {
    BEFORE_MOUNT  = 'bm',
    MOUNTED       = 'm',
    BEFORE_UPDATE = 'bu', 
    UPDATED       = 'u' 
}

function createHook(type:any){
    return (hook:any, target:any = currentInstance){
        
    }
}
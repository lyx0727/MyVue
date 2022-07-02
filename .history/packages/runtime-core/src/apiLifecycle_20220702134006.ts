import { currentInstance, setCurrentInstance } from "./component";

export const enum LifecycleHooks {
    BEFORE_MOUNT  = 'bm',
    MOUNTED       = 'm',
    BEFORE_UPDATE = 'bu', 
    UPDATED       = 'u' 
}

function createHook(type:any){
    return (hook:any, target:any = currentInstance)=>{
        if(target){
            const hooks = target[type] || (target[type] = []);
            const wrappedHook = ()=>{
                // bind 'instance' to its lifecycle 'hooks'
                setCurrentInstance(target);
                hook();
                setCurrentInstance(null);
            }
        }
    }
}
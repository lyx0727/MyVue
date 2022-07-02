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
            hooks.push(wrappedHook);
        }
    }
}

// factory
export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT);
export const onMounted = createHook(LifecycleHooks.MOUNTED);
export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE);
export const onBUpdated = createHook(LifecycleHooks.BEFORE_UPDATE);
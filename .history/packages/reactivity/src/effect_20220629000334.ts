// current 'effect'
export let activeEffect:any = undefined;

function cleanupEffect(effect:any){
    const {deps} = effect;
    for(let i = 0; i < deps.length; i++){
        deps[i].delete(effect);
    }
    effect.deps.length = 0;
}

class ReactiveEffect{
    public active = true;
    public parent = null;
    public deps = [];
    constructor(public fn:Function) {}
    
    run(){
        if(!this.active){
            return this.fn();
        }
        try{
            
            // in case be invoked by another 'effect'
            // stack push
            this.parent = activeEffect;
            // set current 'effect'
            activeEffect = this;
            // clean 
            cleanupEffect(this);
            return this.fn();
        }
        finally{
            // stack pop
            activeEffect = this.parent;
        }
    }
}

export function effect(fn:Function){
    const _effect = new ReactiveEffect(fn);
    _effect.run();
}

const targetMap = new WeakMap();
export function track(target:any, type:string, key:string|symbol){
    if(!activeEffect) return;
    let depsMap = targetMap.get(target);
    if(!depsMap){
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if(!dep){
        depsMap.set(key, (dep = new Set()));
    }
    let shouldTrack = !dep.has(activeEffect);
    if(shouldTrack){
        // bidirectional map
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}

export function trigger(target:any, type:string, key:string|symbol, value:any, oldValue:any){
    const depsMap = targetMap.get(target);
    if(!depsMap) return;

    let effects = depsMap.get(key);

    if(effects){
        // copy to avoid infinite 
        effects = new Set(effects);
        effects.forEach((effect:any) => {
            // acoid self-recursion
            if(effect !== activeEffect){
                effect.run();
            }
        });
    }
}
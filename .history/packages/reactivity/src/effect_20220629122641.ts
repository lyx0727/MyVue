// current 'effect'
export let activeEffect:any = undefined;

function cleanupEffect(effect:any){
    const {deps} = effect;
    for(let i = 0; i < deps.length; i++){
        deps[i].delete(effect);
    }
    effect.deps.length = 0;
}

export class ReactiveEffect{
    public active = true;
    public parent = null;
    public deps = [];

    constructor(public fn:Function, public scheduler:Function) {}
    
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

    stop(){
        if(this.active){
            this.active = false;
            cleanupEffect(this);
        }
    }
}

export function effect(fn:Function, options:any = {}){
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();

    // bind this
    const runner:any = _effect.run.bind(_effect);
    // mount 'effect' on 'runner'
    runner.effect = _effect;
    return runner;
}

export function trackEffect(dep:any){
    let shouldTrack = !dep.has(activeEffect);
    if(shouldTrack){
        // bidirectional map
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
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
    trackEffect(dep);
}

export function triggerEffects(effects:any){

}

export function trigger(target:any, type:string, key:string|symbol, value:any, oldValue:any){
    const depsMap = targetMap.get(target);
    if(!depsMap) return;

    let effects = depsMap.get(key);

    if(effects){
        // copy to avoid infinite loop
        effects = new Set(effects);
        effects.forEach((effect:any) => {
            // avoid self-recursion
            if(effect !== activeEffect){
                if(effect.scheduler){
                    effect.scheduler();
                }
                else{
                    effect.run();
                }
            }
        });
    }
}
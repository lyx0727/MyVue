export let activeEffect:any = undefined;
class ReactiveEffective{
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
            return this.fn();
        }
        finally{
            // stack pop
            activeEffect = this.parent;
        }
    }
}

export function effect(fn:Function){
    const _effect = new ReactiveEffective(fn);
    _effect.run();
}

export function track(target:any, type:String, key:String){
    if(!activeEffect) return;
}
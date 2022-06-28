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
            // set current 'effect'
            this.parent = activeEffect;
            activeEffect = this;
            return this.fn();
        }
        finally{
            activeEffect = undefined;
        }
    }
}

export function effect(fn:Function){
    const _effect = new ReactiveEffective(fn);
    _effect.run();
}
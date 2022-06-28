export let activeEffect:any = undefined;
class ReactiveEffective{
    public active = true;
    constructor(public fn:Function) {}
    
    run(){
        if(!this.active){
            return this.fn();
        }
        try{
            // set current 'effect'
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
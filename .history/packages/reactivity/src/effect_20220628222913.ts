export let activeEffect:any = undefined;
class ReactiveEffective{
    public active = true;
    constructor(public fn:any) {}
    
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

export function effect(fn){
    const _effect = new ReactiveEffective(fn);
}
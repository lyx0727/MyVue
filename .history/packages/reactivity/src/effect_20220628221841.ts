export let activeEffect = undefined;
class ReactiveEffective{
    public active = true;
    constructor(public fn:any) {}
    
    run(){
        if(!this.active){
            return this.fn();
        }
        try{
            activeEffect = this;
        }
    }
}

export function effect(){

}
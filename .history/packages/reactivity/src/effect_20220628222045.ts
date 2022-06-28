export let activeEffect = null;
class ReactiveEffective{
    public active = true;
    constructor(public fn:any) {}
    
    run(){
        if(!this.active){
            return this.fn();
        }
        try{
            activeEffect = this;
            return this.fn();
        }
        finally{

        }
    }
}

export function effect(){

}
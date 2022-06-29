import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";

class ComputedRefImpl{
    public dep = new Set;
    public effect;
    public _dirty = true;
    public _value:any;
    
    constructor(getter:any, public setter:any){
        this.effect = new ReactiveEffect(getter, () => {
            
            
        })  
    }

    get value(){
        // changed
        if(this._dirty){
            this._value = this.effect.run();       
        }
        return this._value;
    }

    set value(){

    }
}

export function computed(getterOrOptions:any){
    let getter, setter;
    if(isFunction(getterOrOptions)){
        getter = getterOrOptions;
        setter = () => {console.warn('no setter')}
    }
    else{
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter);
}
 
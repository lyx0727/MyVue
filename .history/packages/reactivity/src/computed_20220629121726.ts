import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";

class ComputedRefImpl{
    public dep = new Set;
    public _effect;
    constructor(getter:any, public setter:any){
        this._effect = new ReactiveEffect(getter, () => {
            
        })  
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
 
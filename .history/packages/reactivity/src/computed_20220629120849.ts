import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";

class ComputedRefImpl{
    constructor(public getter:any, public setter:any){
        new ReactiveEffect    
    }
}

export function computed(getterOrOptions:any){
    let getter;
    let setter;
    if(isFunction(getterOrOptions)){
        getter = getterOrOptions;
        setter = () => {console.warn('no set')}
    }
    else{
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter);
}
 
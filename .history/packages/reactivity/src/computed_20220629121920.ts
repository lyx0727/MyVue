import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";

class ComputedRefImpl{
    public dep = new Set;
    public effect;
    public _dirty = true;
    constructor(getter:any, public setter:any){
        this.effect = new ReactiveEffect(getter, () => {
            if(this._dirty){
                
            }
            return this._value;
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
 
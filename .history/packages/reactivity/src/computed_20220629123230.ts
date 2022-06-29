import { isFunction } from "@vue/shared";
import { ReactiveEffect, track, trackEffects } from "./effect";

class ComputedRefImpl{
    public dep = new Set;
    public effect;
    public _dirty = true;
    public _value:any;
    
    constructor(getter:any, public setter:any){
        this.effect = new ReactiveEffect(getter, () => {
            if(!this._dirty){
                this._dirty = true;
            }
        })  
    }

    get value(){
        // track dependencys
        trackEffects(this.dep);

        // changed
        if(this._dirty){
            this._value = this.effect.run();   
            this._dirty = false;    
        }
        return this._value;
    }

    set value(newValue:any){
        this._value = newValue;
        this._dirty = true;
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
 
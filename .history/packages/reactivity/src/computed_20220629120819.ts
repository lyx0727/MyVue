import { isFunction } from "@vue/shared";

class ComputedRefImpl{
    constructor(public getter:any, public setter:any){

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
 
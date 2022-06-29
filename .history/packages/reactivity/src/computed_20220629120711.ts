import { isFunction } from "@vue/shared";

export function computed(getterOrOptions:any){
    let getter;
    let setter;
    if(isFunction(getterOrOptions)){
        getter = getterOrOptions;
        setter = () => {console.warn('no set')}
    }
    else{
        getter = getterOrOptions.getter;
        setter = getterOrOptions.setter;
    }
}
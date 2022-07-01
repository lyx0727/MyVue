import { reactive } from "@vue/reactivity";
import { hasOwn } from "@vue/shared";

export function initProps(instance:any, rawProps:any){
    const props:any = {};
    const attrs:any = {};

    const options = instance.propsOptions || {};
    if(rawProps){
        for(let key in rawProps){
            const value = rawProps[key];
            if(hasOwn(options, key)){
                props[key] = value;
            }
            else{
                attrs[key] = value;
            }
        }
    }

    // shallowReactive
    instance.props = reactive(props);
    instance.attrs = attrs;
}

export function updateProps(instance:any, prevProps:any, nextProps:any){
    
}
import { hasOwn } from "@vue/shared";

export function initProps(instance:any, rawProps:any){
    const props:any = {};
    const attrs = {};

    const options = instance.propsOptions || {};
    if(rawProps){
        for(let key in rawProps){
            const value = rawProps[key];
            if(hasOwn(options, key)){
                props[key] = value;
            }
            else{

            }
        }
    }
}
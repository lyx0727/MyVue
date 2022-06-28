import { isObject } from "@vue/shared";

export function reactive(target: any){
    if(!isObject(target)){  // meant for Object-type
        return target;
    }

    const proxy = new Proxy(target, {
        get(target, key, receiver){

        },
        set(target, key, value, receiver){
            
            return Reflect.set(target, key, value, receiver);
        }
    })
}
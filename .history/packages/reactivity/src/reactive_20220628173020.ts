import { isObject } from "@vue/shared";

// record 
const reactiveMap = new WeakMap();

export function reactive(target: any){
    if(!isObject(target)){  // meant for Object-type
        return target;
    }

    const proxy = new Proxy(target, {
        get(target, key, receiver){
            
            // receiver: proxy
            // change 'this' from 'target' to 'proxy'
            // in case 'get' a attribute which invoke 'get' again
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver){
            
            return Reflect.set(target, key, value, receiver);
        }
    })
}
import { isObject } from "@vue/shared";

// record object which has had proxy
const reactiveMap = new WeakMap();

export function reactive(target: any){
    // only for Object-type
    if(!isObject(target)){  
        return target;
    }

    // can have exactly ONE proxy
    const exisitingProxy = reactiveMap.get(target);
    if(exisitingProxy){
        return exisitingProxy;
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
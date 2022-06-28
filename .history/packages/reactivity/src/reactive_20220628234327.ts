import { isObject } from "@vue/shared";
import { track } from "./effect";

// record object which has had proxy
const reactiveMap = new WeakMap();

const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
};

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

    // 'target' has been a proxy
    if(target[ReactiveFlags.IS_REACTIVE]){
        return target;
    }

    const proxy = new Proxy(target, {
        get(target, key, receiver){
            if(key === ReactiveFlags.IS_REACTIVE){
                return true;
            }

            track(target, 'get', key);

            // receiver: proxy
            // change 'this' from 'target' to 'proxy'
            // in case 'get' a attribute which invoke 'get' again
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver){
            let oldValue = target[key];
            return Reflect.set(target, key, value, receiver);
        }
    })
    // record
    reactiveMap.set(target, proxy);
    return proxy;
}
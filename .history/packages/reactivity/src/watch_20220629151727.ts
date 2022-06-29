import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";

function traversal(value:any, set:any = new Set){
    if(!isObject(value)){
        return;
    }
    if(set.has(value)){
        return;
    }
    set.add(value);
    for(const key in value){
        traversal(value[key], set);
    }
}

export function watch(source:any, cb:Function){
    let getter;
    if(isReactive(source)){
        // make a tranversal to all properties
        getter = () => traversal(source)
    }    
    else if(isFunction(source)){
        getter = source;
    }
    else{
        return;
    }

    const onCleanup = ()=>{

    }
    let oldValue:any = undefined; 
    let cleanup:any = undefined; 
    const job = ()=>{
        if(cleanup){
            cleanup();
        }
        let newValue = effect.run();
        cb(oldValue, newValue, onCleanup);
        oldValue = newValue;
    }

    const effect = new ReactiveEffect(getter, job);
    oldValue = effect.run();
}
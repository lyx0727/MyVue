import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "vue";
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

    let newValue;
    let job = ()=>{
        cb();
    }

    const effect = new ReactiveEffect(getter, );

}
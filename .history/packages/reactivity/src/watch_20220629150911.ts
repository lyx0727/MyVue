import { isObject } from "@vue/shared";
import { isReactive } from "./reactive";

function traversal(value:any, set:any = new Set){
    if(!isObject(value)){
        return;
    }
    for(const key in value){
        value[key]
    }
}

export function watch(source:any, cb:Function){
    let getter;
    if(isReactive(source)){
        // make a tranversal to all properties
        getter = () => traversal(source)
    }    
}
import { isArray } from "@vue/shared";
import { createVnode, isVnode } from "./vnode";

export function h(type:any, propsChildren:any, children:any){
    const l = arguments.length;
    if(l === 2){
        if(!isArray(propsChildren)){
        if(isVnode(propsChildren)){
            return createVnode(type, null, [propsChildren]);
        }
        }
        else{
            return createVnode(type, propsChildren);
        }
    }
    else{
        if(l > 3){

        }
        else if(l === 3){

        }
    }
}
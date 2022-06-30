import { isArray, isObject } from "@vue/shared";
import { createVnode, isVnode } from "./vnode";

export function h(type:any, propsChildren:any, children:any){
    const l = arguments.length;
    if(l === 2){
        if(isObject(propsChildren) && !isArray(propsChildren)){
            // single 'vnode' without children
            if(isVnode(propsChildren)){ 
                // wrap 'vnode' to array
                return createVnode(type, null, [propsChildren]);
            }
            // props without children
            return createVnode(type, propsChildren);
        }
    }
    else{
        if(l > 3){

        }
        else if(l === 3 && isVnode(children)){

        }
        
    }
}
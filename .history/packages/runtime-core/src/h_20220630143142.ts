import { isArray } from "@vue/shared";
import { createVnode, isVnode } from "./vnode";

export function h(type:any, propsChildren:any, children:any){
    const l = arguments.length;
    if(l === 2){
        if(!isArray(propsChildren)){
            if(isVnode(propsChildren)){ 
                // wrap 'vnode' to array
                return createVnode(type, null, [propsChildren]);
            }
            return createVnode(type, propsChildren);
        }
        else{
            
        }
    }
    else{
        if(l > 3){

        }
        else if(l === 3){

        }
    }
}
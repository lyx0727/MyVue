import { isArray, isObject } from "@vue/shared";
import { createVnode, isVnode } from "./vnode";

export function h(type:any, propsOrChildren:any, children:any){
    const l = arguments.length;
    if(l === 2){
        if(isObject(propsOrChildren) && !isArray(propsOrChildren)){
            // single 'vnode' without children
            if(isVnode(propsOrChildren)){ 
                // wrap 'vnode' to array
                return createVnode(type, null, [propsOrChildren]);
            }
            // props without children
            return createVnode(type, propsOrChildren);
        }
        else{
            // array, omit props
            return createVnode(type, null, propsOrChildren);
        }
    }
    else{
        if(l > 3){
            children = Array.from(arguments).slice(2);
        }
        else if(l === 3 && isVnode(children)){
            children = [children];
        }
        return createVnode(type, propsOrChildren, children)l
    }
}
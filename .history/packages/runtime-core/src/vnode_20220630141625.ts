import { isArray, isString, ShapeFlags } from "@vue/shared";

export function createVnode(type:any, props:any, children:any){
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
    
    const vnode = {
        shapeFlag,
    }

    if(children){
        let type = 0;
        if(isArray(children)){
            type = ShapeFlags.ARRAY_CHILDREN;
        }
    }
}
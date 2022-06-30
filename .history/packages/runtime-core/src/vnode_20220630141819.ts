import { isArray, isString, ShapeFlags } from "@vue/shared";

export function isVnode(value:any){
    return value && value.__v_isVnode;
}

export function createVnode(type:any, props:any, children:any){
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
    
    const vnode = {
        __v_isVnode: true,
        shapeFlag,
        props,
        key: props?.['key'],
        children
    }

    if(children){
        let type = 0;
        if(isArray(children)){
            type = ShapeFlags.ARRAY_CHILDREN;
        }
        else{
            children = String(children);
            type = ShapeFlags.TEXT_CHILDREN;
        }
        vnode.shapeFlag |= type;
    }
    return vnode;
}
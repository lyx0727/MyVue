import { isArray, isFunction, isObject, isString, ShapeFlags } from "@vue/shared";

export const Text = Symbol("Text");
export const Fragment = Symbol("Fragment");

export function isVnode(value:any){
    return value && value.__v_isVnode;
}

export function isSameVnode(n1:any, n2:any){
    return (n1.type === n2.type) && (n1.key === n2.key);
}

export function createVnode(type:any, props:any, children:any = null){
    let shapeFlag = 
        isString(type) ? ShapeFlags.ELEMENT : 
        isObject(type) ? ShapeFlags.STATEFUL_COMPONENT :
        isFunction(type) ? ShapeFlags.FUNCTIONAL_COMPONENT : 0;
    
    const vnode = {
        type,
        props,
        children,
        el: null,
        key: props?.['key'],
        __v_isVnode: true,
        shapeFlag
    };

    if(children){
        let type = 0;
        if(isArray(children)){
            type = ShapeFlags.ARRAY_CHILDREN;
        }
        else if(isObject(children)){
            type = ShapeFlags.SLOTS_CHILDREN;
        }
        else{
            children = String(children);
            type = ShapeFlags.TEXT_CHILDREN;
        }
        vnode.shapeFlag |= type;
    }
    return vnode;
}

let currentBlock = null;
export function openBlock(){
    currentBlock = [];
}

export function createElementBlock(type:any, props:any, children:any = null){

}

export function _createElementVnode(){

}

export function toDisplayString(){

}
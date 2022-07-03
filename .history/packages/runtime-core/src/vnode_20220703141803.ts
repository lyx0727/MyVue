import { isArray, isFunction, isObject, isString, ShapeFlags } from "@vue/shared";

export const Text = Symbol("Text");
export const Fragment = Symbol("Fragment");

export function isVnode(value:any){
    return value && value.__v_isVnode;
}

export function isSameVnode(n1:any, n2:any){
    return (n1.type === n2.type) && (n1.key === n2.key);
}

export function createVnode(type:any, props:any, children:any = null, patchFlag:any = 0){
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
        shapeFlag,
        patchFlag
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
    if(currentBlock && vnode.patchFlag > 0){
        currentBlock.push(vnode);
    }
    return vnode;
}

export {createVnode as createElementVnode};
export {createVnode as createTextVNode};

let currentBlock:any = null;
export function openBlock(){
    currentBlock = [];
}

export function createElementBlock(type:any, props:any, children:any, patchFlag:any){
    return setupBlock(createVnode(type, props, children, patchFlag));
}

function setupBlock(vnode:any){
    vnode.dynamicChildren = currentBlock;
    currentBlock = null;
    return vnode;
}

export function _createElementVnode(){

}

export function _createTextVNode(){
     
}

export function toDisplayString(value:any){
    return isString(value)
    ? value
    : value == null
    ? ''
    : isObject(value)
    ? JSON.stringify(value)
    : String(value)
}
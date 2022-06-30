import { isString, ShapeFlags } from "@vue/shared";

export function createVnode(type:any, props:any, children:any){
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0; 
}
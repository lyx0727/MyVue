import { isString } from "@vue/shared";

export function createVnode(type:any, props:any, children:any){
    let shapeFlag = isString(type) ? 
}
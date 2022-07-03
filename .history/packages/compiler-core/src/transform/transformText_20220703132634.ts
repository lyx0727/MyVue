import { NodeTypes } from "../ast"

// TODO
export function isTest(node:any){
    return node.type === NodeTypes.ELEMENT || node.type === NodeTypes.INTERPOLATION;
}

export function transformText(node:any, context:any){
    return ()=>{

 }
}
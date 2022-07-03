import { NodeTypes } from "../ast"

// TODO
export function isText(node:any){
    return node.type === NodeTypes.ELEMENT || node.type === NodeTypes.INTERPOLATION;
}

export function transformText(node:any, context:any){
    if(isText(node)){
        return ()=>{

        }
    }
}
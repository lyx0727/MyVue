import { createVnode } from "./vnode";

export function h(type:any, propsChildren:any, children:any){
    const l = arguments.length;
    if(l === 2){
        createVnode(type, propsChildren);
    }
    else{
        if(l > 3){

        }
        else if(l === 3){

        }
    }
}
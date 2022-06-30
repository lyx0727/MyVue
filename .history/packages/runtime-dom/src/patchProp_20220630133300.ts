import { patchClass } from "./modules/class";

export function patchProp(el:any, key:string, prevValue:any, nextValue:any){
    if(key === 'class'){
        patchClass(el, nextValue);
    }

}
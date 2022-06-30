import { patchClass } from "./modules/class";
import { patchStyle } from "./modules/style";

export function patchProp(el:any, key:string, prevValue:any, nextValue:any){
    if(key === 'class'){
        patchClass(el, nextValue);
    }
    else if(key === 'style'){
        patchStyle(el, prevValue, nextValue);
    }

}
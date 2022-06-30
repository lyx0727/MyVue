export function patchAttr(el:any, key:any, nextValue:any){
    if(nextValue){
        el.setAttribute(key, nextValue);
    }
}
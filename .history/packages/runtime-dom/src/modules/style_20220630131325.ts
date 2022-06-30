export function patchStyle(el:any, prevValue:any, nextValue:any){
    for(const key in nextValue){
        el.style[key] = nextValue[key];
    }
}
export function patchStyle(el:any, prevValue:any, nextValue:any){
    // cover exsited
    for(const key in nextValue){
        el.style[key] = nextValue[key];
    }
}
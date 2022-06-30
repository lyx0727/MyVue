export function patchStyle(el:any, prevValue:any, nextValue:any){
    // cover existed
    for(const key in nextValue){
        el.style[key] = nextValue[key];
    }
}
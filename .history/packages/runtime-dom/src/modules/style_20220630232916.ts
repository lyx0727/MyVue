export function patchStyle(el:any, prevValue:any, nextValue:any){
    // cover existed
    for(const key in nextValue){
        el.style[key] = nextValue[key];
    }
    // remove not want but existed
    if(prevValue){
        for(const key in prevValue){
            if(nextValue[key] === null){
                el.style[key] = null;
            }
        }
    }
}
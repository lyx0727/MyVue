export function patchStyle(el:any, prevValue:any, nextValue:any){
    // cover existed
    for(let key in nextValue){
        el.style[key] = nextValue[key];
    }
    // remove not want but existed
    if(prevValue && nextValue){
        for(let key in prevValue){
            if(nextValue[key] == null){
                el.style[key] = null;
            }
        }
    }
}
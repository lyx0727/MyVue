export function patchStyle(el:any, prevValue:any, nextValue:any){
    // cover existed
    for(let key in nextValue){
        el.style[key] = nextValue[key];
    }
    // remove not want but existed
    if(prevValue){
        for(let key in prevValue){
            if(key === 'style') 
            debugger
            if(nextValue[key] == null){
                el.style[key] = null;
            }
        }
    }
}
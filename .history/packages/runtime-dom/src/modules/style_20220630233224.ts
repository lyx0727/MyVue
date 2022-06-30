export function patchStyle(el:any, prevValue:any, nextValue:any){
    // cover existed
    for(let key in nextValue){
        el.style[key] = nextValue[key];
    }
    debugger
    // remove not want but existed
    if(prevValue){
        for(let key in prevValue){
            console.log(key)
            if(key === 'backgroundColor'){
                debugger
            
            }
            if(nextValue[key] == null){
                el.style[key] = null;
            }
        }
    }
}
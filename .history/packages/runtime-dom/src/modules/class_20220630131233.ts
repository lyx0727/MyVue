export function patchClass(el:any, prevValue:any, nextValue:any){
    if(nextValue === null){
        el.removeAttribute('class');
    }  
    else{
        el.className = nextValue;
    }
}
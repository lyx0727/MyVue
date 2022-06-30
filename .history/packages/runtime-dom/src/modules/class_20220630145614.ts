export function patchClass(el:any, nextValue:any){
    if(nextValue === null){
        el.removeAttribute('class');
    }  
    else{
        el.className = nextValue;
    }
}
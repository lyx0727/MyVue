export function patchClass(el:any, prevValue:any, nextValue:any){
    if(nextValue === null){

    }
    else{
        el.className = nextValue;
    }
}
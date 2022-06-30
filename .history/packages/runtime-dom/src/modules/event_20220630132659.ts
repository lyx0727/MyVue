function createInvoker(cb:any){
    const invoker = (e:any) => invoker.value(e);
    invoker.value = cb;
    return invoker;  
}

export function patchEvent(el:any, eventName:any, nextValue:any){
    // vei = vue event invoke
    let invokers = el._vei || (el._vei = {});
    let exist = invokers[eventName];

    if(exist){
        exist.value = nextValue;
    }
    else{
        let event = eventName.slice(2).toLowerCase();

        if(nextValue){
            const invoker = invokers[eventName] = createInvoker(nextValue);
        
        }
    }
}
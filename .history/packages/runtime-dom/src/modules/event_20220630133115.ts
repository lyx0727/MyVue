function createInvoker(cb:any){
    const invoker = (e:any) => invoker.value(e);
    invoker.value = cb;
    return invoker;  
}

export function patchEvent(el:any, eventName:any, nextValue:any){
    // 'vei' = 'vue event invoker'
    // a cache for event invokers
    let invokers = el._vei || (el._vei = {});
    let exist = invokers[eventName];

    if(exist && nextValue){
        exist.value = nextValue;
    }
    else{
        // 'onXxx' --> 'xxx'
        let event = eventName.slice(2).toLowerCase();

        if(nextValue){
            const invoker = invokers[eventName] = createInvoker(nextValue);
            el.addEventListener(event, invoker);
        }
        else if(exist){
            el.removeEventListener(event, exist);
            invokers[eventName] = undefined;
        }
    }
}
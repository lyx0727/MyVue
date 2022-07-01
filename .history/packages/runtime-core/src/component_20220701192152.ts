export function createComponentInstance(vnode:any){
    const instance = {
        data, 
        vnode,  // '_vnode' in vue2
        subTree: null,  
        isMounted: false,
        update: ()=>{},
    }
}
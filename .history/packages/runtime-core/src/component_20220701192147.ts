export function createComponentInstance(vnode:any){
    const instance = {
        state, 
        vnode,  // '_vnode' in vue2
        subTree: null,  
        isMounted: false,
        update: ()=>{},
    }
}
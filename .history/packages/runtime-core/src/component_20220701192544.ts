import { initProps } from "./componentProps";

export function createComponentInstance(vnode:any){
    const instance = {
        data:null, 
        vnode,  // '_vnode' in vue2
        subTree: null,  
        isMounted: false,
        update: ()=>{},
        propsOptions: vnode.type.props,
        props: {},
        attrs: {},
        proxy: null
    };
    return instance;
}

export function setupComponent(instance:any){
    let {props} = instance;

    initProps(instance);
}
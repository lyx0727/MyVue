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

const publicPropertyMap = {
    $attrs: i:any=>i.attrs
}

const publicComponentProxy = {
    get(target:any, key:string|symbol){
        const {data, props} = target;
        if(data && hasOwn(data, key)){
            return data[key];
        }
        else if(props && hasOwn(props, key)){
            return props[key];
        }
        // this.$attrs
        let getter = publicPropertyMap[key];
    } 
}

export function setupComponent(instance:any){
    let {props} = instance;

    initProps(instance);
}
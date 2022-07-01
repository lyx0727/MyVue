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

const publicPropertyMap:any = {
    $attrs: (i:any)=>i.attrs
}

const publicInstanceProxy = {
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
        if(getter){
            return getter(target);
        }
    },
    set(target:any, key:string|symbol, value:any){
        const {data, props} = target;
        if(data && hasOwn(data, key)){
            data[key] = value;
            return true;
        }
        else if(props && hasOwn(props, key)){
            console.warn('attemping to mutate prop ' + (key as string));
            return false;
        }
        return true;
    }
}

export function setupComponent(instance:any){
    let {props} = instance;

    initProps(instance);
}
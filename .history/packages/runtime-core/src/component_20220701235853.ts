import { reactive } from "@vue/reactivity";
import { hasOwn, isFunction } from "@vue/shared";
import { initProps } from "./componentProps";

export function createComponentInstance(vnode:any){
    const instance = {
        data: null, 
        vnode,  // '_vnode' in vue2
        subTree: null,  
        isMounted: false,
        update: ()=>{},
        propsOptions: vnode.type.props,
        props: {},
        attrs: {},
        proxy: null,
        render: null,
        setupState: {},
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
    let {props, type} = instance.vnode;

    initProps(instance, props);
    instance.proxy = new Proxy(instance, publicInstanceProxy);

    let data = type.data;
    if(data){
        if(!isFunction(data)){
            return console.warn('data option must be a function');
        }
        instance.data = reactive(data.call(instance.proxy));
    }
    let setup = type.setup;
    if(setup){
        const setupContext = {};
        const setupResult = setup(instance.props, setupContext);
        if()
    }
    instance.render = type.render;
}
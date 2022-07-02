import { proxyRefs, reactive } from "@vue/reactivity";
import { hasOwn, isFunction, isObject, ShapeFlags } from "@vue/shared";
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
        slots: {}
    };
    return instance;
}

const publicPropertyMap:any = {
    $slots: (i:any)=>i.slots,
    $attrs: (i:any)=>i.attrs
}

const publicInstanceProxy = {
    get(target:any, key:string|symbol){
        const {data, props, setupState} = target;
        if(data && hasOwn(data, key)){
            return data[key];
        }
        else if(props && hasOwn(props, key)){
            return props[key];
        }
        else if(setupState && hasOwn(setupState, key)){
            return setupState[key];
        }
        // this.$attrs
        let getter = publicPropertyMap[key];
        if(getter){
            return getter(target);
        }
    },
    set(target:any, key:string|symbol, value:any){
        const {data, props, setupState} = target;
        if(data && hasOwn(data, key)){
            data[key] = value;
        }
        else if(props && hasOwn(props, key)){
            console.warn('attemping to mutate prop ' + (key as string));
            return false;
        }
        else if(setupState && hasOwn(setupState, key)){
            setupState[key] = value;
        }
        return true;
    }
}

function initSlots(instance:any, children:any){
    if(instance.ShapeFlags & ShapeFlags.SLOTS_CHILDREN){
        instance.slots = children;
    }
}

export function setupComponent(instance:any){
    let {props, type, children} = instance.vnode;

    initProps(instance, props);
    initSlots(instance, children);

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
        const setupContext = {
            // customer 'event'
            emit:(event:any, ...args:any)=>{
                const eventName = `on${event[0].toUpperCase() + event.slice(1)}`;
                const handler = instance.vnode.props[eventName];
                handler && handler(...args);
            }
        };
        const setupResult = setup(instance.props, setupContext);
        if(isFunction(setupResult)){
            instance.render = setupResult;
        }
        else if(isObject(setupResult)){
            // remove suffix '.value'
            instance.setupState = proxyRefs(setupResult);
        }
    }
    if(!instance.render){
        instance.render = type.render;
    }
}
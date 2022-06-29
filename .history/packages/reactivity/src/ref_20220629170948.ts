import { isArray, isObject } from "@vue/shared";
import { trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

function toReactive(value:any){
    return isObject(value) ? reactive(value) : value;
}

const enum RefFlags{
    IS_REF = '__v_isRef'
}

export function isRef(value:any){
    return value && value[RefFlags.IS_REF]
}

class RefImpl{
    public _value:any;
    public __v_isRef = true;
    public dep = new Set;
    constructor(public rawValue:any) {
        this._value = toReactive(rawValue);
    }

    get value(){
        trackEffects(this.dep);
        return this._value;
    }

    set value(newValue){
        if(newValue !== this.rawValue){
            this._value = toReactive(newValue);
            this.rawValue = newValue;
            triggerEffects(this.dep);
        }
    }
}

export function ref(value:any){
    return new RefImpl(value);
}

class ObjectRefImpl{
    constructor(public object:any, public key:string|symbol) {}

    get value(){
        return this.object[this.key];
    }

    set value(newValue:any){
        this.object[this.key] = newValue;
    }
}

// just create a proxy to 'object[key]'
// and you have to use suffix '.value'
export function toRef(object:any, key:string|symbol){
    return new ObjectRefImpl(object, key);
}

export function toRefs(object:any){
    let res:any = isArray(object) ? new Array(object.length) : {};
    for(const key in object){
        res[key] = toRef(object, key);
    }
    return res;
}

export function proxyRefs(object:any){
    return new Proxy(object, {
        get(target, key, receiver) {
            Reflect
        },
        set(target, key, value, receiver) {
            
        },
    })
}
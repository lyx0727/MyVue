import { isArray } from "@vue/shared";

class RefImpl{
    constructor(public value:any) {
        
    }

    get value(){

    }

    set value(){
        
    }
}

export function ref(){

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
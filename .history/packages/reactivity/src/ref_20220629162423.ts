class ObjectRefImpl{
    constructor(public object:any, public key:string|symbol) {}

    get value(){
        return this.object[this.key];
    }

    set value(newValue:any){
        this.object[this.key] = newValue;
    }
}

export function toRef(object:any, key:string|symbol){
    return new ObjectRefImpl(object, key);
}
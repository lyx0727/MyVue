class ObjectRefImpl{
    constructor(public object:any, public key:string|symbol) {}

    get value(){
        return this.object[this.key];
    }


}

export function toRef(object:any, key:string|symbol){
    return 
}
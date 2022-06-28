import { isObject } from "@vue/shared";

export function reactive(target: any){
    if(!isObject(target)){
        return target;
    }
}
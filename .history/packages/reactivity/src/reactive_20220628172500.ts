import { isObject } from "@vue/shared";

export function reactive(target: any){
    if(!isObject(target)){  // meant for Object-type
        return target;
    }

    
}
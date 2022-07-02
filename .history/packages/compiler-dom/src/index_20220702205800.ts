import { baseCompile } from "@vue/compiler-core";

export function compile(template:any){
    return baseCompile(template);
}
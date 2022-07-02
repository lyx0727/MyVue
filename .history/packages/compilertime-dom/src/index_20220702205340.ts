import { baseCompile } from "@vue/compilertime-core";

export function compile(template:any){
    return baseCompile(template);
}
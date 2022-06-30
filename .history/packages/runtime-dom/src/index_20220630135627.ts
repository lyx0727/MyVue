import { createRenderer } from "packages/runtime-core/src/renderer";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";

const renderOptions =  Object.assign(nodeOps, {patchProp});



export function render(vnode:any, container:any){
    return createRenderer(renderOptions).render(vnode, container);
}
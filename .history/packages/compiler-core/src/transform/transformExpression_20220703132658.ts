import { NodeTypes } from "../ast";

// TODO
export function transformExpression(node:any, context:any){
    if(node.type === NodeTypes.INTERPOLATION){
        const content = node.content.content;
        node.content.content = `_ctx.${content}`;
    }
}   
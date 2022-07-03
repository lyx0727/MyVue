import { NodeTypes } from "../ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";
import { transformElement } from "./transformElement";
import { transformExpression } from "./transformExpression";
import { transformText } from "./transformText";

export function transform(ast:any){
    const context = createTransformContext(ast);
}

function createTransformContext(root:any){
    const context = {
        currentNode: root,
        parent: null,
        // optimizer, count invoked times
        helpers: new Map,
        helper(name:any){
            const count = context.helpers.get(name) || 0;
            context.helpers.set(name, count + 1);
            return name;
        },
        nodeTransforms: [
            transformText,
            transformElement,
            transformExpression
        ]
    }
    return context;
}

function traverse(node:any, context:any){
    context.currentNode = node;
    const transforms = context.nodeTransforms;
    for(let i = 0; i < transforms.length; i++){
        transforms[i](node);
    }
    // in case 'currentNode' changed
    context.currentNode = node;
    switch(node.type){
        case NodeTypes.INTERPOLATION:
            context.helper(TO_DISPLAY_STRING);
            break;
        case NodeTypes.ROOT:
        case NodeTypes.ELEMENT:
            for(let i = 0; i < node.children.length; i++){
                traverse(node.children[i], context);
            } 
    }
}
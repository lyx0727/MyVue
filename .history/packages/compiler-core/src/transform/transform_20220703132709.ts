import { NodeTypes } from "../ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";
import { transformElement } from "./transformElement";
import { transformExpression } from "./transformExpression";
import { transformText } from "./transformText";

// TODO
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
    const exitsFns = []; 
    for(let i = 0; i < transforms.length; i++){
        const onExit = transforms[i](node);
        if(onExit){
            exitsFns.push(onExit);
        }
        // in case 'currentNode' deleted 
        if(!context.currentNode){
            return; 
        }
    }
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
    context.currentNode = node;
    let i = exitsFns.length;
    while(i--){
        exitsFns[i]();
    }
}
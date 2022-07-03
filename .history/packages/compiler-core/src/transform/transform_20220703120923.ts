import { NodeTypes } from "./ast";

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
        case NodeTypes.ROOT:
        case NodeTypes.ELEMENT:
            for(let i = 0; i < node.children.length; i++){
                traverse(node.children[i], context);
            } 
    }
}
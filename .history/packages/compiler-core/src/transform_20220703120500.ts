export function transform(ast:any){
    const context = createTransformContext(ast);
}

function createTransformContext(root:any){
    const context = {
        currentNode: root,
        parent: null,
        // optimizer, count times has been invoked
        helpers: new Map,
        helper(name:any){
            const count = context.helpers.get(name) || 0;
            context.helpers.set(name, count + 1);
            return name;
        }
    }
}
export function transform(ast:any){
    const context = createTransformContext(ast);
}

function createTransformContext(root:any){
    const context = {
        currentNode: root,
        parent: null,
        // optimizer
        helpers: new Map,
    }
}
export const nodeOps = {
    insert(child:any, parent:any, anchor:any = null){
        parent.insertBefore(child, anchor);
    },
    remove(child:any){
        const parent = child.parentNode;
        if(parent){
            parent.removeNode(child);
        }
    }
}
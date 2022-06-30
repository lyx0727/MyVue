export const nodeOps = {
    insert(child:any, parent:any, anchor:any = null){
        parent.insertBefore(child, anchor);
    }
}
import { ShapeFlags } from "@vue/shared";

export function createRenderer(renderOptions:any){
    const {
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText,
        setText: hostSetText,
        patchProp: hostPatchProp,
        createElement: hostCreateElement,
        createText: hostCreateTextt,
    } = renderOptions;

    const mountChildren = (children:any, container:any)=>{
        for(let i = 0; i < children.length; i++){
            patch(null, children[i], container);
        }
    }

    const mountElement = (vnode:any, container:any)=>{
        let {type, props, children, shapeFlag} = vnode;
        let el = vnode.el = hostCreateElement(type);
        if(props){
            for(let key in props){
                hostPatchProp(el, key, null, props[key]);
            }
        }
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            hostSetElementText(el, children);
        }
        else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
            mountChildren(children, container);
        }
    }

    const patch = (n1:any, n2:any, container:any)=>{
        if(n1 === n2){
            return;
        }
        if(n1 === null){
            mountElement(n2, container);    
        }
        else if(){

        }
        else{

        }
    }

    const render = (vnode:any, container:any)=>{
        if(vnode === null){

        }
        else{
            
        }
    };
    return {
        render
    };
}
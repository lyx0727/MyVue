import { isString, ShapeFlags } from "@vue/shared";
import { createVnode, Text } from "./vnode";

export function createRenderer(renderOptions:any){
    const {
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText,
        setText: hostSetText,
        patchProp: hostPatchProp,
        createElement: hostCreateElement,
        createText: hostCreateText,
    } = renderOptions;

    const normalize = (child:any)=>{
        if(isString(child)){
            return createVnode(Text, null, child);
        }
        return child;
    }

    const mountChildren = (children:any, container:any)=>{
        for(let i = 0; i < children.length; i++){
            let child = normalize(children[i]);
            patch(null, child, container);
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
        hostInsert(el, container);
    }

    const processText = (n1:any, n2:any, container:any)=>{
        if(n1 === null){
            hostInsert((n2.el = hostCreateText(n2.children)));
        }
    }

    const patch = (n1:any, n2:any, container:any)=>{
        if(n1 === n2){
            return;
        }
        // in case 'n2' is a text
        const {type, shapeFlag} = n2;
        if(n1 === null){
            switch(type){
                case Text:
                    processText(n1, n2, container);
                    break;
                default:
                    if(shapeFlag & ShapeFlags.ELEMENT){
                        mountElement(n2, container);
                    }
            }    
        }
        else if(){
processText
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
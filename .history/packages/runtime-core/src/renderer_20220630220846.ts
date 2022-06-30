import { isString, ShapeFlags } from "@vue/shared";
import { createVnode, isSameVnode, Text } from "./vnode";

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
            mountChildren(children, el);
        }
        hostInsert(el, container);
    }

    const processText = (n1:any, n2:any, container:any)=>{
        if(n1 === null){
            hostInsert((n2.el = hostCreateText(n2.children)), container);
        }
        else{
            // 'text' changed, reuse old node
            const el = n2.el = n1.el;
            if(n1.children !== n2.children){
                hostSetText(el, n2.children);
            }
        }
    }

    const processElement = (n1:any, n2:any, container:any)=>{
        // mount
        if(n1 === null){
            mountElement(n2, container);
        }
        // update
        else{
            patchElement(n1, n2, container);
        }
    }

    const patchProps = (oldProps:any, newProps:any, el:any)=>{
        for(let key in newProps){
            hostPatchProp(el, key, oldProps[key], newProps[key]);
        }

        for(let key in oldProps){
            if(newProps[key] === null){
                hostPatchProp(el, key, oldProps[key], null);
            }
        }
    }

    const patchChildren = (n1:any, n2:any, el:any)=>{

    }

    const patchElement = (n1:any, n2:any, container:any)=>{
        // reuse element
        const el = n2.el = n1.el;

        // patch props
        let oldProps = n1.props || {};
        let newProps = n2.props || {};
        patchProps(oldProps, newProps, el);
    
        // patch children
        patchChildren(n1, n2, el);
    }

    const patch = (n1:any, n2:any, container:any)=>{
        if(n1 === n2){
            return;
        }

        // not same type, unmount old node
        if(n1 && !isSameVnode(n1, n2)){
            unmount(n1);
            n1 = null;
        }

        // in case 'n2' is a text
        const {type, shapeFlag} = n2;

        switch(type){
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if(shapeFlag & ShapeFlags.ELEMENT){
                    processElement(n1, n2, container);
                }
        }    

        
    }

    const unmount = (vnode:any)=>{
        hostRemove(vnode.el);
    };

    const render = (vnode:any, container:any)=>{
        // unmount
        if(vnode === null){
            if(container._vnode){
                unmount(container._vnode);
            }
        }
        // mount or update
        else{
            patch(container._vnode || null, vnode, container);
        }

        container._vnode = vnode;
    };

    return {
        render
    };
}
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

    const normalize = (children:any, i:any)=>{
        if(isString(children[i])){
            const vnode = createVnode(Text, null, children[i]);
            children[i] = vnode;
        }
        return children[i];
    }

    const unmount = (vnode:any)=>{
        hostRemove(vnode.el);
    };

    const mountChildren = (children:any, container:any)=>{
        for(let i = 0; i < children.length; i++){
            let child = normalize(children, i);
            patch(null, child, container);
        }
    }

    const mountElement = (vnode:any, container:any, anchor:any = null)=>{
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
        hostInsert(el, container, anchor);
    }

    const processText = (n1:any, n2:any, container:any)=>{
        if(n1 == null){
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

    const processElement = (n1:any, n2:any, container:any, anchor:any = null)=>{
        // mount
        if(n1 == null){
            mountElement(n2, container, anchor);
        }
        // update
        else{
            patchElement(n1, n2, container,);
        }
    }

    const patchProps = (oldProps:any, newProps:any, el:any)=>{
        for(let key in newProps){
            hostPatchProp(el, key, oldProps[key], newProps[key]);
        }

        for(let key in oldProps){
            if(newProps[key] == null){
                hostPatchProp(el, key, oldProps[key], null);
            }
        }
    }

    const unmountChildren = (children:any)=>{
        for(let i = 0; i < children.length; i++){
            unmount(children[i]);
        }
    }

    const patchChildren = (n1:any, n2:any, el:any)=>{
        const c1 = n1.children;
        const c2 = n2.children;
        const prevShapeFlag = n1.shapeFlag;
        const shapeFlag = n2.shapeFlag;
        // { (old -> new) | old, new in { null, text, array } }

        //  (null | text | array -> text)
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            // (array -> text)
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                // clear previous array
                unmountChildren(c1);
            }
            // (null | text -> text)
            if(c1 !== c2){
                hostSetElementText(el, c2);
            }
        }
        // (null | text | array -> null | array)
        else{
            // (array -> null | array)
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                 // (array -> array)
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
                    // diff
                    debugger
                    let i = 0;
                    let e1 = c1.length - 1;
                    let e2 = c2.length - 1;

                    while(i <= e1 && i <= e2){
                        const n1 = c1[i];
                        const n2 = c2[i];
                        if(isSameVnode(n1, n2)){
                            patch(n1, n2, el);
                        }
                        else{
                            break;
                        }
                        i++;
                    }

                    while(i <= e1 && i <= e2){
                        const n1 = c1[e1];
                        const n2 = c2[e2];
                        if(isSameVnode(n1, n2)){
                            patch(n1, n2, el);
                        }
                        else{
                            break;
                        }
                        e1--;
                        e2--;
                    }
                    // mount new node
                    if(i > e1){
                        if(i <= e2){
                            while(i <= e2){
                                const nextPos = e2 + 1;
                                const anchor = nextPos < c2.length ? c2[nextPos].el : null;
                                patch(null, c2[i], el, anchor);
                                i++;
                            }
                        }
                    }
                    // unmount old node
                    else if(i > e2){
                        if(i <= e1){
                            while(i <= e1){
                                unmount(c1[i]);
                                i++;
                            }
                        }
                    }

                }
                // (array -> null)
                else{
                    unmountChildren(c1);
                }
            }
            // (null | text -> null | array)
            else{
                // (text -> null | array)
                if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
                    // clear previous text
                    hostSetElementText(el, '');
                }
                // (text -> array)
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
                    mountChildren(c2, el);
                }
                // (text -> null)
                // do nothing
            }
        }
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

    const patch = (n1:any, n2:any, container:any, anchor:any = null)=>{
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
                    processElement(n1, n2, container, anchor);
                }
        }            
    }

    

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
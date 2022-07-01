import { isString, ShapeFlags } from "@vue/shared";
import { createVnode, isSameVnode, Text, Fragment } from "./vnode";

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr: number[]): number[] {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = (u + v) >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
}

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

    const mountComponent = (vnode:any, container:any, anchor:any = null)=>{
        
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

    const processFragment = (n1:any, n2:any, container:any)=>{
        if(n1 == null){
            mountChildren(n2.children, container);
        }
        else{
            patchChildren(n1, n2, container);
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

    const processComponent = (n1:any, n2:any, container:any, anchor:any = null)=>{
        // mount
        if(n1 == null){
            mountComponent(n2, container, anchor);
        }
        // update
        else{

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

                    const s1 = i;
                    const s2 = i;
                    const keyToNewIndexMap = new Map;
                    for(let i = s2; i <= e2; i++){
                        keyToNewIndexMap.set(c2[i].key, i);
                    }

                    const toBePatched = e2 - s2 + 1;
                    let newIndexToOldIndexMap = new Array(toBePatched).fill(0);
                    for(let i = s1; i <= e1; i++){
                        const oldChild = c1[i];
                        let newIndex = keyToNewIndexMap.get(oldChild.key);
                        if(newIndex == null){
                            unmount(oldChild);
                        }
                        else{
                            newIndexToOldIndexMap[newIndex - s2] = i + 1;
                            patch(oldChild, c2[newIndex], el);
                        }
                    }
                    // move to correct position
                    const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap);
                    let j = increasingNewIndexSequence.length - 1;
                    for(let i = toBePatched - 1; i >= 0; i--){
                        let index = i + s2;
                        let current = c2[index];
                        let anchor = index + 1 < c2.length ? c2[index + 1].el : null;

                        if(newIndexToOldIndexMap[i] === 0){
                            patch(null, current, el, anchor);   
                        }
                        // patched
                        else{
                            if(j < 0 || i !== increasingNewIndexSequence[j]){
                                hostInsert(current.el, el, anchor);
                            }
                            else{
                                j--;
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

        const {type, shapeFlag} = n2;
        switch(type){
            case Text:
                processText(n1, n2, container);
                break;
            case Fragment:
                processFragment(n1, n2, container);
                break;
            default:
                if(shapeFlag & ShapeFlags.ELEMENT){
                    processElement(n1, n2, container, anchor);
                }
                else if(shapeFlag & ShapeFlags.COMPONENT){
                    processComponent(n1, n2, container, anchor)
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
export const nodeOps = {
    // CURD
    insert(child:any, parent:any, anchor:any = null){
        parent.insertBefore(child, anchor);
    },
    remove(child:any){
        const parentNode = child.parentNode;
        if(parentNode){
            parentNode.removeChild(child);
        }
    },
    setElementText(el:any, text:string){
        // 'innerHtml' is dangerous
        el.textContent = text;
    },
    setText(node:any, text:string){
        node.nodeValue = text;
    },
    querySelector(selector:any){
        return document.querySelector(selector);
    },
    parentNode(node:any){
        return node.parentNode;
    },
    nextSibling(node:any){
        return node.nextSibling;
    },
    createElement(tagName:string){
        return document.createElement(tagName);
    }
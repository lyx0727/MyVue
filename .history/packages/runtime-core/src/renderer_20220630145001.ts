export function createRenderer(renderOptions:any){
    const {
        createElement: hostCreateElement,
        setElementText: hostSetElementText
        patchProp: hostPatchProp
    } = renderOptions;

    const mountElement = (vnode:any, container:any)=>{

    }

    const patch = (n1:any, n2:any, container:any)=>{
        if(n1 === n2){
            return;
        }
        if(n1 === null){
            mountElement(n2, container);    
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
export const isObject = (value:any)=>{
    return value !== null && typeof value === "object";
}

export const isFunction = (value:any)=>{
    return typeof value === 'function';
}

export const isString = (value:any)=>{
    return typeof value === 'string';
}

export const isArray = Array.isArray;
export const assign = Object.assign;

export const invokeArrayFns = (fns:any)=>{
    for(let i = 0; i < fns.length; i++){
        fns[i]();
    }
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (value:any, key:string|symbol)=>hasOwnProperty.call(value, key);

export * from './shapeFlags';
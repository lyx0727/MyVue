export const isObject = (value:any)=>{
    return value !== null && typeof value === "object";
}

export const isFunction = (value:any)=>{
    return typeof value === 'function';
}

export const isArray = Array.isArray;
export const assign = Object.assign;
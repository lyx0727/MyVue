export const isObject = (value:any)=>{
    return value !== null && typeof value === "object";
}

export const isFunction = (value:any)=>{
    return typeof value === 'function';
}

export const isArray = (value:any)=>{
    return Array.isArray(value)l;
}
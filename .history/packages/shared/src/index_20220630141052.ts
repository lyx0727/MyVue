export const isObject = (value:any)=>{
    return value !== null && typeof value === "object";
}

export const isFunction = (value:any)=>{
    return typeof value === 'function';
}

export const isArray = Array.isArray;
export const assign = Object.assign;

export const enum ShapeFlags {
    ELEMENT              = 1,
    FUNCTIONAL_COMPONENT = 1 << 1,
    STATEFUL_COMPONENT   = 1 << 2,
    TEXT_CHILDREN        = 1 << 3,
    ARRAY_CHILDREN       = 1 << 4,
    SLOTS_CHILDREN       = 1 << 5,
    TELEPORT             = 1 << 5,
}
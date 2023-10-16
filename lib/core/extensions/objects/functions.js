export function methodExists(obj, method) {
    return method in obj && obj[method] instanceof Function
}

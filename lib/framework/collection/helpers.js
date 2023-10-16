export function value(val, ...args) {
    return val instanceof Function ? val(...args) : val
}

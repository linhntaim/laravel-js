import {methodExists} from '../objects/functions.js'

export function isNull(value) {
    return null === value
}

export function isDeclared(value) {
    return undefined !== value
}

export function isset(value, ...values) {
    const valid = v => isDeclared(value) && !isNull(value)
    if (!valid(value)) {
        return false
    }
    if (values.length) {
        for (const val of values) {
            if (!valid(val)) {
                return false
            }
        }
    }
    return true
}

export function empty(value) {
    if (isset(value)) {
        if (typeof value === 'boolean') {
            return !value
        }
        if (typeof value === 'number') {
            return 0 === value
        }
        if (typeof value === 'bigint') {
            return 0n === value
        }
        if (typeof value === 'string') {
            return '' === value
        }
        if (value instanceof Boolean) {
            return !value.valueOf()
        }
        if (value instanceof Number) {
            return 0 === value.valueOf()
        }
        if (value instanceof BigInt) {
            return 0n === value.valueOf()
        }
        if (value instanceof String) {
            return '' === value.valueOf()
        }
        if (isArray(value)) {
            return !value.length
        }
        if (isObject(value)) {
            return !Object.keys(value).length
        }
        return false
    }
    return true
}

export function isArray(value) {
    return Array.isArray(value)
}

export function isString(value) {
    return typeof value === 'string'
}

export function isObject(value) {
    return !isNull(value) && typeof value === 'object' && !isArray(value)
}

export function isFunction(value) {
    return typeof value === 'function'
}

export function isCallable(value, syntaxOnly = false) {
    if (isFunction(value)) {
        return true
    }
    if (isArray(value)) {
        if (syntaxOnly && (isFunction(value[0]) || isObject(value[0]))
            && isString(value[1])) {
            return true
        }
        if (value.length !== 2) {
            return false
        }
        const [instance, method] = value
        if (!(isFunction(instance) || isObject(instance))
            || !isString(method)) {
            return false
        }
        if (!methodExists(instance, method)
            && !methodExists(instance, '__get')) {
            return false
        }
        return true
    }
    if (methodExists(value, '__invoke')) {
        return true
    }
    return false
}

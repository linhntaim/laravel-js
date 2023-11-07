import {methodExists} from '../classes/functions.js'

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

export function isCallable(value, syntaxOnly = false) {
    if (isFunction(value)) {
        return true
    }
    if (isArray(value)) {
        if (value.length !== 2) {
            return false
        }
        if (syntaxOnly &&
            (isFunction(value[0]) || isObject(value[0]))
            && isString(value[1])) {
            return true
        }
        const [target, method] = value
        if (!(isFunction(target) || isObject(target))
            || !isString(method)) {
            return false
        }
        return methodExists(target, method)
            || methodExists(target, '__call')

    }
    return methodExists(value, '__invoke')

}

export function isFunction(value) {
    return typeof value === 'function'
}

export function isNumeric(value) {
    if (typeof value === 'number') {
        return true
    }
    if (isString(value)) {
        return /^\s*[+-]?(\d+|((\d*\.\d+|\d+\.\d*)|(\d+|(\d*\.\d+|\d+\.\d*))[eE][+-]?\d+))\s*$/.test(value)
    }
    return false
}

export function isObject(value) {
    return !isNull(value) && typeof value === 'object' && !isArray(value)
}

export function isString(value) {
    return typeof value === 'string'
}

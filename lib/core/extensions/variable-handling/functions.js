export function isNull(value) {
    return value === null
}

export function isset(value) {
    return value !== undefined && !isNull(value)
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
            return '' === value || '0' === value
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
            return '' === value.valueOf() || '0' === value.valueOf()
        }
        if (value instanceof Array) {
            return !value.length
        }
        if (value instanceof Object) {
            return !Object.keys(value).length
        }
        return false
    }
    return true
}

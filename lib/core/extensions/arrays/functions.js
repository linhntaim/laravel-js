import {isArray, isNull, isObject} from '../variable-handling/functions.js'

/**
 *
 * @param {Array|Object} array
 * @param {boolean|*} def
 * @returns {*|boolean}
 */
export function end(array, def = false) {
    if (isArray(array)) {
        if (array.length) {
            return array.at(-1)
        }
        return def
    }
    return end(Object.values(array), def)
}

/**
 *
 * @param {number} key
 * @param {Array|Object} array
 * @return {boolean}
 */
export function arrayKeyExists(key, array) {
    return key in array
}

/**
 *
 * @param {*} needle
 * @param {Array|Object} haystack
 * @param {boolean} strict
 * @return {boolean}
 */
export function inArray(needle, haystack, strict = false) {
    if (isArray(haystack)) {
        return haystack.findIndex(
            !strict
                ? element => element == needle
                : element => element === needle,
        ) !== -1
    }
    return inArray(needle, Object.values(haystack), strict)
}

/**
 *
 * @param {Array|Object} arr1
 * @param {Array|Object} arr2
 * @param {function|null} overrider2
 * @return {Array|Object}
 * @private
 */
function _arrayMerge2(arr1, arr2, overrider2 = null) {
    if (isArray(arr1) && isArray(arr2)) {
        return [...arr1, ...arr2]
    }

    let increment = 0

    const overrider1 = (to, from, key) => from[key]
    if (isNull(overrider2)) {
        overrider2 = overrider1
    }

    /**
     *
     * @param {Object} to
     * @param {Array|Object} from
     * @param {function} useOverrider
     */
    const overrideAndAppend = (to, from, overrider) => {
        for (const key in from) {
            if (/^-?(0|[1-9]\d*)$/.test(key)) {
                to[increment++] = from[key]
            }
            else {
                to[key] = overrider(to, from, key)
            }
        }
        return to
    }

    return overrideAndAppend(
        overrideAndAppend({}, arr1, overrider1),
        arr2,
        overrider2,
    )
}

function _arrayMerge(overrider2, ...arrays) {
    if (arrays.length === 0) {
        return []
    }

    let array = arrays.shift()
    if (arrays.length === 0) {
        return isArray(array) ? [...array] : {...array}
    }

    while (arrays.length) {
        array = _arrayMerge2(array, arrays.shift(), overrider2)
    }
    return array
}

export function arrayMergeRecursive(...arrays) {
    return _arrayMerge(
        (to, from, key) => key in to
            ? _arrayMerge2(
                isArray(to[key]) || isObject(to[key]) ? to[key] : [to[key]],
                isArray(from[key]) || isObject(from[key]) ? from[key] : [from[key]],
            )
            : from[key],
        ...arrays,
    )
}

export function arrayMerge(...arrays) {
    return _arrayMerge(null, ...arrays)
}

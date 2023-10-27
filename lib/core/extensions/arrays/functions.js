import {isDeclared} from '../variable-handling/functions.js'

/**
 *
 * @param {Array} array
 * @param {boolean|*} def
 * @returns {*|boolean}
 */
export function end(array, def = false) {
    if (array.length) {
        return array.at(-1)
    }
    return def
}

/**
 *
 * @param {number} key
 * @param {Array} array
 * @return {boolean}
 */
export function arrayKeyExists(key, array) {
    return isDeclared(array[key])
}

/**
 *
 * @param {*} needle
 * @param {Array} haystack
 * @param {boolean} strict
 * @return {boolean}
 */
export function inArray(needle, haystack, strict = false) {
    return haystack.findIndex(
        !strict
            ? element => element == needle
            : element => element === needle,
    ) !== -1
}

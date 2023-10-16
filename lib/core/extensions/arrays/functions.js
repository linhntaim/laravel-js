/**
 *
 * @param {array} arr
 * @param {boolean|*} def
 * @returns {*|boolean}
 */
export function end(arr, def = false) {
    if (arr.length) {
        return arr.at(-1)
    }
    return def
}

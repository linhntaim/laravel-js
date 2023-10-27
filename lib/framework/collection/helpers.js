import {isFunction} from '../../core/extensions/variable-handling/functions.js'

export function value(val, ...args) {
    return isFunction(val) ? val(...args) : val
}

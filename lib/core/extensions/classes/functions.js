import {isFunction} from '../variable-handling/functions.js'

/**
 *
 * @param {Object|function} instance
 * @param {string} property
 * @returns {boolean}
 */
export function propertyExists(instance, property) {
    if (isFunction(instance) && propertyExists(instance.prototype, property)) {
        return true
    }
    return property in instance
}

/**
 *
 * @param {Object|function} instance
 * @param {string} method
 * @returns {boolean}
 */
export function methodExists(instance, method) {
    if (isFunction(instance) && methodExists(instance.prototype, method)) {
        return true
    }
    return propertyExists(instance, method) && isFunction(instance[method])
}

/**
 *
 * @param {Object|function} instance
 * @param {function} Class
 * @return {boolean}
 */
export function isSubclassOf(instance, Class) {
    return Class.isPrototypeOf(isFunction(instance) ? instance : instance.constructor)
}

import {methodExists as objMethodExists, propertyExists as objPropertyExists} from '../objects/functions.js'

/**
 *
 * @param {Function} Class
 * @param {string} property
 * @returns {boolean}
 */
export function propertyExists(Class, property) {
    return objPropertyExists(Class.prototype, property)
}

/**
 *
 * @param {Function} Class
 * @param {string} method
 * @returns {boolean}
 */
export function methodExists(Class, method) {
    return objMethodExists(Class.prototype, method)
}

/**
 *
 * @param {Function} Class
 * @param {string} property
 * @returns {boolean}
 */
export function staticPropertyExists(Class, property) {
    return objPropertyExists(Class, property)
}

/**
 *
 * @param {Function} Class
 * @param {string} method
 * @returns {boolean}
 */
export function staticMethodExists(Class, method) {
    return objMethodExists(Class, method)
}

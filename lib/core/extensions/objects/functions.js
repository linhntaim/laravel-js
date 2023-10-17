/**
 *
 * @param {Object} instance
 * @param {string} property
 * @returns {boolean}
 */
export function propertyExists(instance, property) {
    return property in instance
}

/**
 *
 * @param {Object} instance
 * @param {string} method
 * @returns {boolean}
 */
export function methodExists(instance, method) {
    return propertyExists(instance, method) && instance[method] instanceof Function
}

import {arrayKeyExists} from '../../core/extensions/arrays/functions.js'
import {empty, isArray, isNull, isObject, isset} from '../../core/extensions/variable-handling/functions.js'
import {value} from '../collection/helpers.js'

export class Arr
{
    static accessible(value) {
        return isArray(value) || isObject(value)
    }

    static except(array, keys) {
        this.forget(array, keys)
        return array
    }

    static exists(array, key) {
        return arrayKeyExists(key, array)
    }

    /**
     *
     * @param {Array|Object} array
     * @param {function|null} callback
     * @param {*} def
     * @return {*}
     */
    static first(array, callback = null, def = null) {
        if (isNull(callback)) {
            if (empty(array)) {
                return value(def)
            }

            for (const item of (isArray(array) ? array : Object.values(array))) {
                return item
            }
        }

        for (const [value, key] of Object.entries(array)) {
            if (callback(value, key)) {
                return value
            }
        }

        return value(def)
    }

    /**
     *
     * @param array
     * @param keys
     */
    static forget(array, keys) {
        const original = array

        if (!isArray(keys)) {
            keys = [keys]
        }

        if (keys.length === 0) {
            return
        }

        keys.forEach(key => {
            if (this.exists(array, key)) {
                if (isArray(array)) {
                    array.splice(key, 1)
                }
                else {
                    delete array[key]
                }
            }

            const parts = key.toString().split('.')

            array = original

            while (parts.length > 1) {
                const part = parts.shift()
                if (isset(array[part]) && this.accessible(array[part])) {
                    array = array[part]
                }
                else {
                    return
                }
            }

            delete array[parts.shift()]
        })
    }

    /**
     *
     * @param {Array|Object} array
     * @param {int|string|null} key
     * @param def
     * @return {*}
     */
    static get(array, key = null, def = null) {
        if (!this.accessible(array)) {
            return value(def)
        }

        if (isNull(key)) {
            return array
        }

        if (this.exists(array, key)) {
            return array[key]
        }

        key = key.toString()
        if (!key.includes('.')) {
            return array[key] ?? value(def)
        }

        for (const segment of key.split('.')) {
            if (this.accessible(array) && this.exists(array, segment)) {
                array = array[segment]
            }
            else {
                return value(def)
            }
        }

        return array
    }

    static wrap(value) {
        if (isNull(value)) {
            return []
        }

        return isArray(value) ? value : [value]
    }
}

import {arrayMerge, arrayMergeRecursive} from '../../core/extensions/arrays/functions.js'
import {trim} from '../../core/extensions/strings/functions.js'
import {isset} from '../../core/extensions/variable-handling/functions.js'
import {Arr} from '../support/arr.js'

export class RouteGroup
{
    /**
     *
     * @param {Object} newOnes
     * @param {Object} oldOnes
     * @param {boolean} prependExistingPrefix
     * @return {Object}
     */
    static merge(newOnes, oldOnes, prependExistingPrefix = true) {
        if (isset(newOnes.controller)) {
            delete oldOnes.controller
        }

        newOnes = arrayMerge(this._formatAs(newOnes, oldOnes), {
            prefix: this._formatPrefix(newOnes, oldOnes, prependExistingPrefix),
        })
        return arrayMergeRecursive(Arr.except(
            oldOnes, ['prefix', 'as'],
        ), newOnes)
    }

    static _formatPrefix(newOnes, oldOnes, prependExistingPrefix = true) {
        const oldOne = oldOnes.prefix ?? ''
        if (prependExistingPrefix) {
            return isset(newOnes.prefix)
                ? trim(oldOne, '/') + '/' + trim(newOnes.prefix, '/')
                : oldOne
        }
        return isset(newOnes.prefix)
            ? trim(newOnes.prefix, '/') + '/' + trim(oldOne, '/')
            : oldOne
    }

    static _formatAs(newOnes, oldOnes) {
        if (isset(oldOnes.as)) {
            newOnes.as = oldOnes.as + (newOnes.as ?? '')
        }
        return newOnes
    }
}

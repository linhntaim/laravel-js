import {BadMethodCallException} from '../core/extensions/spl/exceptions/bad-method-call-exception.js'

export class OptionInterface
{
    /**
     *
     * @returns {*}
     */
    get() {
        throw new BadMethodCallException('Method not implemented.')
    }

    /**
     *
     * @param {*} def
     * @returns {*}
     */
    getOrElse(def) {
        return def
    }

    /**
     *
     * @param {Function} callback
     * @returns {*}
     */
    getOrCall(callback) {
        return callback()
    }
}

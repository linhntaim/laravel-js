import {methodExists} from '../../core/extensions/classes/functions.js'
import {LogicException} from '../../core/extensions/spl/exceptions/logic-exception.js'
import {UnexpectedValueException} from '../../core/extensions/spl/exceptions/unexpected-value-exception.js'
import {isArray, isNull, isNumeric, isset} from '../../core/extensions/variable-handling/functions.js'
import {Arr} from '../support/arr.js'
import {Reflector} from '../support/reflector.js'

export class RouteAction
{
    /**
     *
     * @param {string} uri
     * @param {function|Array|Object|null} action
     * @return {Object}
     */
    static parse(uri, action) {
        if (isNull(action)) {
            return this._missingAction(uri)
        }

        if (Reflector.isCallable(action, true)) {
            return !isArray(action)
                ? {
                    uses: action,
                }
                : {
                    uses: [action[0], action[1]],
                    controller: [action[0], action[1]],
                }
        }
        else if (!isset(action['uses'])) {
            action.uses = this._findCallable(action)
        }

        if (isArray(action.uses) && action.uses.length === 1) {
            action.uses = this._makeInvokable(action.uses[0])
        }

        return action
    }

    static _missingAction(uri) {
        return {
            uses: function () {
                throw new LogicException(`Route for [${uri}] has no action.`)
            },
        }
    }

    static _findCallable(action) {
        return Arr.first(action, (value, key) => {
            return Reflector.isCallable(value) && isNumeric(key)
        })
    }

    static _makeInvokable(action) {
        if (!methodExists(action, '__invoke')) {
            throw new UnexpectedValueException(`Invalid route action: [${action}]`)
        }
        return [action, '__invoke']
    }
}

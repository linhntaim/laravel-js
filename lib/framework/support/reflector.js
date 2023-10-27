import {isArray, isCallable, isFunction, isObject, isset, isString} from '../../core/extensions/variable-handling/functions.js'
import {methodExists} from '../../core/extensions/objects/functions.js'

export class Reflector
{
    static isCallable(variable, syntaxOnly = false) {
        if (!isArray(variable)) {
            return isCallable(variable, syntaxOnly)
        }

        if (!isset(variable[0], variable[1]) || !isString(variable[1] ?? null)) {
            return false
        }

        if (syntaxOnly
            && (isFunction(variable[0]) || isObject(variable[0]))
            && isString(variable[1])) {
            return true
        }

        const [instance, method] = variable

        if (!(isFunction(instance) || isObject(instance))
            || !isString(method)) {
            return false
        }
        if (!methodExists(instance, method)
            && !methodExists(instance, '__get')) {
            return false
        }
        return true
    }
}

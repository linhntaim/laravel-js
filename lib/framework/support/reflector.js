import {methodExists} from '../../core/extensions/classes/functions.js'
import {isArray, isCallable, isFunction, isObject, isset, isString} from '../../core/extensions/variable-handling/functions.js'

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

        const [target, method] = variable
        if (!(isFunction(target) || isObject(target))
            || !isString(method)) {
            return false
        }
        return methodExists(target, method)
            || methodExists(target, '__call')
    }
}

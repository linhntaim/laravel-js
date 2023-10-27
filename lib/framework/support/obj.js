import {value} from '../collection/helpers.js'
import {isNull} from '../../core/extensions/variable-handling/functions.js'

export class Obj
{
    static accessible(obj) {
        return !isNull(obj)
            && !['undefined', 'boolean', 'number', 'bigint', 'string', 'symbol', 'function'].includes(typeof obj)
            && !(obj instanceof Boolean)
            && !(obj instanceof Number)
            && !(obj instanceof BigInt)
            && !(obj instanceof String)
            && !(obj instanceof Symbol)
            && !(obj instanceof Function)
    }

    static exists(obj, key) {
        return key in obj
    }

    static get(obj, key = null, def = null) {
        if (!Obj.accessible(obj)) {
            return value(obj)
        }
        if (isNull(key)) {
            return obj
        }
        if (Obj.exists(obj, key)) {
            return obj[key]
        }

        key = key.toString()
        if (!key.includes('.')) {
            return obj[key] ?? value(def)
        }
        for (const segment of key.split('.')) {
            if (Obj.accessible(obj) && Obj.exists(obj, segment)) {
                obj = obj[segment]
            }
            else {
                return value(def)
            }
        }
        return obj
    }
}

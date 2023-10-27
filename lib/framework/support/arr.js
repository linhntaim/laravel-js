import {isArray, isNull} from '../../core/extensions/variable-handling/functions.js'

export class Arr
{
    static wrap(value) {
        if (isNull(value)) {
            return []
        }

        return isArray(value) ? value : [value]
    }
}

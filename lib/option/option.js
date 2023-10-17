import {OptionInterface} from './option-interface.js'
import {None} from './none.js'
import {Some} from './some.js'

export class Option extends OptionInterface
{
    static fromValue(value, noneValue = undefined) {
        if (value === noneValue) {
            return None.create()
        }
        return new Some(value)
    }
}

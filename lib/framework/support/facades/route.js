import {__Facade} from './facade.js'
import {magic} from '../../../core/classes/magic.js'

class __Route extends __Facade
{
    static _getFacadeAccessor() {
        return 'router'
    }
}

/**
 *
 * @type {AbstractRouter}
 */
export const Route = magic(__Route)

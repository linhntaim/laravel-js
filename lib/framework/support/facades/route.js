import magic from 'magic-class'
import {__Facade} from './facade.js'

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

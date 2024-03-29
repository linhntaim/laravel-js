import {__Facade} from './facade.js'
import {magic} from '../../../core/classes/magic.js'

class __App extends __Facade
{
    static _getFacadeAccessor() {
        return 'app'
    }
}

/**
 *
 * @type {Application}
 */
export const App = magic(__App)

import magic from 'magic-class'
import {__Facade} from './facade.js'

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

import {facade, Facade} from './facade.js'

/**
 *
 * @type {Application}
 */
export const App = facade(class extends Facade
{
    static _getFacadeAccessor() {
        return 'app'
    }
})

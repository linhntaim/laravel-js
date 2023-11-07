import {methodExists} from '../../../../core/extensions/classes/functions.js'
import {isNull} from '../../../../core/extensions/variable-handling/functions.js'
import {ServiceProvider} from '../../../support/service-provider.js'

export class RouteServiceProvider extends ServiceProvider
{
    /**
     * @type {function|null}
     */
    _loadRoutesUsing = null

    register() {
        this.booted(() => {
            this._loadRoutes()
        })
    }

    boot() {
    }

    /**
     *
     * @param {function} routesCallback
     * @returns {RouteServiceProvider}
     */
    _routes(routesCallback) {
        this._loadRoutesUsing = routesCallback
        return this
    }

    _loadRoutes() {
        if (!isNull(this._loadRoutesUsing)) {
            this._loadRoutesUsing()
        }
        else if (methodExists(this, 'map')) {
            this.map()
        }
    }
}

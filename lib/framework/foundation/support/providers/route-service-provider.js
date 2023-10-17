import {ServiceProvider} from '../../../support/service-provider.js'
import {isNull} from '../../../../core/extensions/variable-handling/functions.js'
import {methodExists} from '../../../../core/extensions/objects/functions.js'

export class RouteServiceProvider extends ServiceProvider
{
    /**
     * @type {Function|null}
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
     * @param {Function} routesCallback
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

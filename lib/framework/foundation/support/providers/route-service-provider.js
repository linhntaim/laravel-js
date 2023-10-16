import {ServiceProvider} from '../../../support/service-provider.js'
import {isNull, isset} from '../../../../core/extensions/variable-handling/functions.js'
import {methodExists} from '../../../../core/extensions/objects/functions.js'

export class RouteServiceProvider extends ServiceProvider
{
    /**
     * @type {Function|null}
     */
    #loadRoutesUsing = null

    register() {
        this.booted(() => {
            this.#loadRoutes()
        })
    }

    boot() {
    }

    /**
     *
     * @param {Function} routesCallback
     * @returns {RouteServiceProvider}
     */
    routes(routesCallback) {
        this.#loadRoutesUsing = routesCallback
        return this
    }

    #loadRoutes() {
        if (!isNull(this.#loadRoutesUsing)) {
            this.#loadRoutesUsing()
        }
        else if (methodExists(this, 'map')) {
            this.map()
        }
    }
}

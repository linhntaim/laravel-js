import {RuntimeException} from '../../../core/extensions/spl/exceptions/runtime-exception.js'
import {isset} from '../../../core/extensions/variable-handling/functions.js'

export class __Facade
{
    /**
     * @type {Application}
     */
    static _app

    /**
     *
     * @type {Map<string|Function, any>}
     */
    static _resolvedInstance

    /**
     *
     * @type {boolean}
     */
    static _cached = true

    static getFacadeRoot() {
        return this._resolveFacadeInstance(this._getFacadeAccessor())
    }

    static _getFacadeAccessor() {
        throw new RuntimeException('Facade does not implement getFacadeAccessor method.')
    }

    static _resolveFacadeInstance(name) {
        if (this._resolvedInstance.has(name)) {
            return this._resolvedInstance.get(name)
        }

        if (isset(this._app)) {
            if (this._cached) {
                this._resolvedInstance.set(name, this._app.make(name))
                return this._resolvedInstance.get(name)
            }

            return this._app.make(name)
        }
    }

    static clearResolvedInstance(name) {
        this._resolvedInstance.delete(name)
    }

    static clearResolvedInstances() {
        this._resolvedInstance = new Map()
    }

    /**
     *
     * @returns {Application}
     */
    static getFacadeApplication() {
        return this._app
    }

    /**
     *
     * @param {Application} app
     */
    static setFacadeApplication(app) {
        this._app = app
    }

    static __get(prop) {
        const instance = this.getFacadeRoot()

        if (!isset(instance)) {
            throw new RuntimeException('A facade root has not been set.')
        }

        return Reflect.get(instance, prop)
    }
}

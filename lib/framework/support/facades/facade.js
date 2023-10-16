import {RuntimeException} from '../../../core/extensions/spl/exceptions/runtime-exception.js'
import {isset} from '../../../core/extensions/variable-handling/functions.js'

export class Facade
{
    /**
     * @type {Application}
     */
    static app

    /**
     *
     * @type {Map<string|Function, any>}
     */
    static resolvedInstance

    /**
     *
     * @type {boolean}
     */
    static cached = true

    static getFacadeRoot() {
        return this.resolveFacadeInstance(this.getFacadeAccessor())
    }

    static getFacadeAccessor() {
        throw new RuntimeException('Facade does not implement getFacadeAccessor method.')
    }

    static resolveFacadeInstance(name) {
        if (this.resolvedInstance.has(name)) {
            return this.resolvedInstance.get(name)
        }

        if (isset(this.app)) {
            if (this.cached) {
                this.resolvedInstance.set(name, this.app.make(name))
                return this.resolvedInstance.get(name)
            }

            return this.app.make(name)
        }
    }

    static clearResolvedInstance(name) {
        this.resolvedInstance.delete(name)
    }

    static clearResolvedInstances() {
        this.resolvedInstance = new Map()
    }

    /**
     *
     * @returns {Application}
     */
    static getFacadeApplication() {
        return this.app
    }

    /**
     *
     * @param {Application} app
     */
    static setFacadeApplication(app) {
        this.app = app
    }

    static get instance() {
        const instance = this.getFacadeRoot()

        if (!isset(instance)) {
            throw new RuntimeException('A facade root has not been set.')
        }

        return instance
    }

    static create(facadeAccessor) {
        return this.createWith(
            class extends Facade
            {
                static getFacadeAccessor() {
                    return facadeAccessor
                }
            },
        )
    }

    static createWith(facadeClass) {
        return () => facadeClass.instance
    }
}

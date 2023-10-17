import {RuntimeException} from '../../../core/extensions/spl/exceptions/runtime-exception.js'
import {isset} from '../../../core/extensions/variable-handling/functions.js'

export class Facade
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

    static get instance() {
        const instance = this.getFacadeRoot()

        if (!isset(instance)) {
            throw new RuntimeException('A facade root has not been set.')
        }

        return instance
    }
}

export function facade(facadeClass) {
    return new Proxy(facadeClass, {
        apply(target, thisArg, argArray) {
            return Reflect.apply(target, thisArg, argArray)
        },
        construct(target, argArray, newTarget) {
            return Reflect.construct(target.instance, argArray, newTarget)
        },
        defineProperty(target, property, attributes) {
            return Reflect.defineProperty(target.instance, property, attributes)
        },
        deleteProperty(target, p) {
            return Reflect.deleteProperty(target.instance, p)
        },
        get(target, p, receiver) {
            return Reflect.get(target.instance, p, receiver)
        },
        getOwnPropertyDescriptor(target, p) {
            return Reflect.getOwnPropertyDescriptor(target.instance, p)
        },
        getPrototypeOf(target) {
            return Reflect.getPrototypeOf(target.instance)
        },
        has(target, p) {
            return Reflect.has(target.instance, p)
        },
        isExtensible(target) {
            return Reflect.isExtensible(target.instance)
        },
        ownKeys(target) {
            return Reflect.ownKeys(target.instance)
        },
        preventExtensions(target) {
            return Reflect.preventExtensions(target.instance)
        },
        set(target, p, newValue, receiver) {
            return Reflect.set(target.instance, p, newValue, receiver)
        },
        setPrototypeOf(target, v) {
            return Reflect.setPrototypeOf(target.instance, v)
        },
    })
}

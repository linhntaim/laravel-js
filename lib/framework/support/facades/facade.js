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

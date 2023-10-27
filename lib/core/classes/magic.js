import {Exception} from '../exceptions/exception.js'
import {isNull} from '../extensions/variable-handling/functions.js'

export function magic(Class) {
    const InstanceHandler = {
        singletonEnabled: false,
        singletonInstance: null,
        getInstance(classProxy, ...parameters) {
            return Reflect.construct(classProxy, parameters)
        },
        getSingleton(classProxy, ...parameters) {
            this.singletonEnabled = true
            return this.getInstance(classProxy, ...parameters)
        },
        getInstanceProxy(constructClass, constructParams, newTarget) {
            const createInstanceProxy = () => {
                console.log('new instance created')
                const instance = Reflect.construct(constructClass, constructParams, newTarget)
                const invoker = Reflect.has(instance, '__invoke')
                    ? Reflect.get(instance, '__invoke')
                    : null
                const handler = {
                    get(target, p, receiver) {
                        if (Reflect.has(instance, p)) {
                            return Reflect.get(instance, p, receiver)
                        }
                        if (Reflect.has(instance, '__get')) {
                            const getter = Reflect.get(instance, '__get', receiver)
                            if (getter instanceof Function) {
                                return getter.call(instance, p)
                            }
                        }

                        throw new Exception('Property not implemented.')
                    },
                    set(target, p, newValue, receiver) {
                        if (Reflect.has(instance, p)) {
                            return Reflect.set(instance, p, newValue, receiver)
                        }
                        if (Reflect.has(instance, '__set')) {
                            const setter = Reflect.get(instance, '__set', receiver)
                            if (setter instanceof Function) {
                                return setter.call(instance, p, newValue)
                            }
                        }

                        throw new Exception('Property not implemented.')
                    },
                    has(target, p) {
                        return Reflect.has(instance, p)
                    },
                    getPrototypeOf(target) {
                        return Reflect.getPrototypeOf(instance)
                    },
                }

                return isNull(invoker)
                    ? new Proxy(instance, handler)
                    : new Proxy(invoker, {
                        apply(target, thisArg, argArray) {
                            return Reflect.apply(target, instance, argArray)
                        },
                        ...handler,
                    })
            }
            if (this.singletonEnabled) {
                if (isNull(this.singletonInstance)) {
                    this.singletonInstance = createInstanceProxy()
                }
                return this.singletonInstance
            }
            return createInstanceProxy()
        },
    }
    const ClassProxy = new Proxy(Class, {
        construct(targetClass, argArray, newTarget) {
            return InstanceHandler.getInstanceProxy(targetClass, argArray, newTarget)
        },
        get(targetClass, p, receiver) {
            switch (p) {
                case '__static':
                    return ClassProxy
                case '__instance':
                    return function (...parameters) {
                        return InstanceHandler.getInstance(ClassProxy, ...parameters)
                    }
                case '__singleton':
                    return function (...parameters) {
                        return InstanceHandler.getSingleton(ClassProxy, ...parameters)
                    }
                default:
                    if (Reflect.has(targetClass, p)) {
                        return Reflect.get(targetClass, p, receiver)
                    }
                    if (Reflect.has(targetClass, '__get')) {
                        const getter = Reflect.get(targetClass, '__get', receiver)
                        if (getter instanceof Function) {
                            return getter.call(targetClass, p)
                        }
                    }

                    throw new Exception('Static property not implemented.')
            }
        },
        set(targetClass, p, newValue, receiver) {
            if (Reflect.has(targetClass, p)) {
                return Reflect.set(targetClass, p, newValue, receiver)
            }
            if (Reflect.has(targetClass, '__set')) {
                const setter = Reflect.get(targetClass, '__set', receiver)
                if (setter instanceof Function) {
                    return setter.call(targetClass, p, newValue)
                }
            }

            throw new Exception('Static property not implemented.')
        },
    })
    return ClassProxy
}

export const MagicMixin = Class => class extends Class
{
    static ___magic

    static {
        this.___magic = magic(this)
    }

    static get __static() {
        return this.___magic
    }

    static __singleton(...parameters) {
        return this.___magic.__singleton(...parameters)
    }

    static __instance(...parameters) {
        return this.___magic.__instance(...parameters)
    }
}

export class MagicClass
{
    static ___magic

    static get __static() {
        return this.___magic
    }

    static __magic() {
        this.___magic = magic(this)
    }

    static __singleton(...parameters) {
        return this.___magic.__singleton(...parameters)
    }

    static __instance(...parameters) {
        return this.___magic.__instance(...parameters)
    }
}

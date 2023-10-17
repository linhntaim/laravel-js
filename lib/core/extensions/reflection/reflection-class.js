import {Reflector} from './reflector.js'
import {ReflectionMethod} from './reflection-method.js'

export class ReflectionClass extends Reflector
{
    _class

    /**
     *
     * @param {Function} Class
     * @returns {ReflectionClass}
     */
    static createFrom(Class) {
        const reflection = Class.__reflection__ ?? {}
        return (instance => {
            instance._class = Class
            instance._reflection._constructor = ReflectionMethod.create(
                instance,
                'constructor',
                (reflection.constructorParams ?? []),
            )
            return instance
        })(new ReflectionClass(Class.name))
    }

    /**
     *
     * @returns {ReflectionMethod}
     */
    getConstructor() {
        return this._reflection._constructor
    }

    newInstanceArgs(args = []) {
        return Reflect.construct(this._class, args)
    }

    toStaticObject() {
        const obj = super.toStaticObject()
        obj.constructorParams = this.getConstructor().toStaticObject().params ?? []
        return obj
    }
}

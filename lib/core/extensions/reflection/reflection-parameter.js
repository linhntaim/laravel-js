import {Reflector} from './reflector.js'
import {ReflectionMethod} from './reflection-method.js'
import {isDeclared} from '../variable-handling/functions.js'

export class ReflectionParameter extends Reflector
{
    /**
     * @type {ReflectionFunctionAbstract}
     * @private
     */
    _reflectionFunction

    /**
     *
     * @param {ReflectionFunctionAbstract} reflectionFunction
     * @param {string} name
     * @param {*} type
     * @param {*} defaultValue
     * @returns {ReflectionParameter}
     */
    static create(reflectionFunction, name, type, defaultValue) {
        return (instance => {
            instance._reflectionFunction = reflectionFunction
            return instance
        })(new ReflectionParameter({
            name,
            type,
            defaultValue,
        }))
    }

    getType() {
        return this._reflection.type
    }

    isDefaultValueAvailable() {
        return isDeclared(this._reflection.defaultValue)
    }

    getDefaultValue() {
        return this._reflection.defaultValue
    }

    /**
     *
     * @returns {ReflectionClass|null}
     */
    getDeclaringClass() {
        if (this._reflectionFunction instanceof ReflectionMethod) {
            return this._reflectionFunction.getDeclaringClass()
        }
        return null
    }

    getDeclaringFunction() {
        return this._reflectionFunction
    }

    toStaticObject() {
        const obj = super.toStaticObject()
        obj.type = this.getType()
        if (this.isDefaultValueAvailable()) {
            obj.defaultValue = this.getDefaultValue()
        }
        return obj
    }
}

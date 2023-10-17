import {ReflectionFunctionAbstract} from './reflection-function-abstract.js'
import {ReflectionParameter} from './reflection-parameter.js'

export class ReflectionMethod extends ReflectionFunctionAbstract
{
    /**
     * @type {ReflectionClass}
     * @private
     */
    _reflectionClass

    /**
     *
     * @param {ReflectionClass} reflectionClass
     * @param {string} name
     * @param {Object[]} parameters
     * @returns {ReflectionMethod}
     */
    static create(reflectionClass, name, parameters = []) {
        return (instance => {
            instance._reflectionClass = reflectionClass
            instance._reflection.params = parameters.map(parameter => {
                return ReflectionParameter.create(
                    instance,
                    parameter.name,
                    parameter.type,
                    parameter.defaultValue,
                )
            })
            return instance
        })(new ReflectionMethod(name))
    }

    /**
     *
     * @returns {ReflectionClass}
     */
    getDeclaringClass() {
        return this._reflectionClass
    }
}

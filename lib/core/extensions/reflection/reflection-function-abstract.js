import {Reflector} from './reflector.js'

export class ReflectionFunctionAbstract extends Reflector
{
    /**
     *
     * @returns {ReflectionParameter[]}
     */
    getParameters() {
        return this._reflection.params ?? []
    }

    getNumberOfParameters() {
        return this.getParameters().length
    }

    toStaticObject() {
        const obj = super.toStaticObject()
        if (this.getNumberOfParameters()) {
            obj.params = this.getParameters().map(parameter => parameter.toStaticObject())
        }
        return obj
    }
}

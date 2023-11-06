import magic from 'magic-class'
import {arrayKeyExists, inArray} from '../../core/extensions/arrays/functions.js'
import {BadMethodCallException} from '../../core/extensions/spl/exceptions/bad-method-call-exception.js'
import {InvalidArgumentException} from '../../core/extensions/spl/exceptions/invalid-argument-exception.js'
import {isArray, isFunction, isNull, isString} from '../../core/extensions/variable-handling/functions.js'
import {Arr} from '../support/arr.js'
import {Obj} from '../support/obj.js'
import {Reflector} from '../support/reflector.js'

export class __RouteRegistrar
{
    _router

    _attributes = {}

    _passthru = [
        'get', 'post', 'put', 'patch', 'delete', 'options', 'any',
    ]

    _allowedAttributes = [
        'as',
        'controller',
        'domain',
        'middleware',
        'name',
        'namespace',
        'prefix',
        'scopeBindings',
        'where',
        'withoutMiddleware',
    ]

    _aliases = {
        'name': 'as',
        'scopeBindings': 'scope_bindings',
        'withoutMiddleware': 'excluded_middleware',
    }

    constructor(router) {
        this._router = router
    }

    attribute(key, value) {
        if (!this._allowedAttributes.includes(key)) {
            throw new InvalidArgumentException(`Attribute [${key}] does not exist.`)
        }

        // TODO:

        const attributeKey = Obj.get(this._aliases, key, key)

        if (key === 'withoutMiddleware') {
            value = this._attributes[attributeKey] ?? []
            value.push(Arr.wrap(value))
        }

        this._attributes[attributeKey] = value

        return this
    }

    /**
     *
     * @param {Function[]|Function} callback
     * @return {__RouteRegistrar}
     */
    group(callback) {
        this._router.group(this._attributes, callback)
        return this
    }

    /**
     *
     * @param {string} method
     * @param {string} uri
     * @param {Function|Array|null} action
     */
    _registerRoute(method, uri, action = null) {
        this._router[method](uri, this._compileAction(action))
    }

    _compileAction(action) {
        if (isNull(action)) {
            return {...this._attributes}
        }

        if (isString(action) || isFunction(action)) {
            action = {uses: action}
        }

        if (isArray(action)
            && Reflector.isCallable(action)) {
            action = {
                uses: [action[0], action[1]],
                controller: [action[0], action[1]],
            }
        }
        return {...this._attributes, ...action}
    }

    __get(prop) {
        if (inArray(prop, this._passthru)) {
            return (...parameters) => this._registerRoute(prop, ...parameters)
        }

        if (inArray(prop, this._allowedAttributes)) {
            if (prop === 'middleware') {
                return (...parameters) => this.attribute(prop, isArray(parameters[0]) ? parameters[0] : parameters)
            }

            return (...parameters) => this.attribute(prop, arrayKeyExists(0, parameters) ? parameters[0] : true)
        }

        throw new BadMethodCallException(`Method ${prop} does not exist.`)
    }
}

export const RouteRegistrar = magic(__RouteRegistrar)

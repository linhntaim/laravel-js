import {Registrar as RegistrarContract} from '../contracts/routing/registrar.js'
import {Container} from '../container/container.js'
import {BadMethodCallException} from '../../core/extensions/spl/exceptions/bad-method-call-exception.js'
import {RouteRegistrar} from './route-registrar.js'
import {isArray} from '../../core/extensions/variable-handling/functions.js'
import {arrayKeyExists} from '../../core/extensions/arrays/functions.js'

export class AbstractRouter extends RegistrarContract
{
    /**
     * @type {Dispatcher}
     */
    _events

    /**
     * @type {Container}
     */
    _container

    constructor(events, container = null) {
        super()

        this._events = events
        this._container = container ?? new Container()
    }

    get(uri, action = null) {
        return this.addRoute(['GET', 'HEAD'], uri, action)
    }

    post(uri, action = null) {
        return this.addRoute(['POST'], uri, action)
    }

    /**
     *
     * @param {Array} methods
     * @param {string} uri
     * @param {Function|Array} action
     * @return void
     */
    addRoute(methods, uri, action) {
        throw new BadMethodCallException('Method not implemented.')
    }

    _createRoute(methods, uri, action) {
        throw new BadMethodCallException('Method not implemented.')
    }

    /**
     *
     * @return {*}
     */
    dispatch() {
        throw new BadMethodCallException('Method not implemented.')
    }

    /**
     *
     * @param {Function[]} middleware
     * @return {AbstractRouter}
     */
    globalMiddleware(middleware) {
        throw new BadMethodCallException('Method not implemented.')
    }

    __get(prop) {
        // TODO:

        if (prop === 'middleware') {
            return (...parameters) => new RouteRegistrar(this).attribute(prop, isArray(parameters[0]) ? parameters[0] : parameters)
        }

        // TODO:

        return (...parameters) => new RouteRegistrar(this).attribute(prop, arrayKeyExists(0, parameters) ? parameters[0] : true)
    }
}

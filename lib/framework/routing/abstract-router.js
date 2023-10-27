import {Registrar as RegistrarContract} from '../contracts/routing/registrar.js'
import {Container} from '../container/container.js'
import {BadMethodCallException} from '../../core/extensions/spl/exceptions/bad-method-call-exception.js'
import {RouteRegistrar} from './route-registrar.js'
import {empty, isArray, isFunction} from '../../core/extensions/variable-handling/functions.js'
import {arrayKeyExists, end} from '../../core/extensions/arrays/functions.js'
import {Arr} from '../support/arr.js'
import {RouteGroup} from './route-group.js'

/**
 *
 * @property {(middleware:(Array|string|null)) => __RouteRegistrar} middleware
 */
export class AbstractRouter extends RegistrarContract
{
    static verbs = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']

    /**
     * @type {Dispatcher}
     */
    _events

    /**
     * @type {Container}
     */
    _container

    _groupStack = []

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
     * @param {Object} attributes
     * @param {Function[]|Function} routes
     * @return {AbstractRouter}
     */
    group(attributes, routes) {
        Arr.wrap(routes).forEach(groupRoutes => {
            this._updateGroupStack(attributes)

            this._loadRoutes(groupRoutes)

            this._groupStack.pop()
        })
        return this
    }

    _updateGroupStack(attributes) {
        if (this.hasGroupStack()) {
            attributes = this.mergeWithLastGroup(attributes)
        }

        this._groupStack.push(attributes)
    }

    mergeWithLastGroup(newOnes, prependExistingPrefix = true) {
        return RouteGroup.merge(newOnes, end(this._groupStack), prependExistingPrefix)
    }

    /**
     *
     * @param {Function} routes
     * @private
     */
    _loadRoutes(routes) {
        if (isFunction(routes)) {
            routes(this)
        }
    }

    /**
     *
     * @param {Array} methods
     * @param {string} uri
     * @param {Function|Array|null} action
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

    hasGroupStack() {
        return !empty(this._groupStack)
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

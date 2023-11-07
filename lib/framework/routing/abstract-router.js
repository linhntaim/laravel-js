import {end} from '../../core/extensions/arrays/functions.js'
import {BadMethodCallException} from '../../core/extensions/spl/exceptions/bad-method-call-exception.js'
import {trim} from '../../core/extensions/strings/functions.js'
import {empty, isArray, isFunction, isObject, isset, isString} from '../../core/extensions/variable-handling/functions.js'
import {Container} from '../container/container.js'
import {Registrar as RegistrarContract} from '../contracts/routing/registrar.js'
import {Arr} from '../support/arr.js'
import {RouteGroup} from './route-group.js'
import {RouteRegistrar} from './route-registrar.js'
import {Route} from './route.js'

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
        return this.addRoute('POST', uri, action)
    }

    /**
     *
     * @param {Object} attributes
     * @param {function|function[]} routes
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

    /**
     *
     * @param {Object} newOnes
     * @param {boolean} prependExistingPrefix
     * @return {Object}
     */
    mergeWithLastGroup(newOnes, prependExistingPrefix = true) {
        return RouteGroup.merge(newOnes, end(this._groupStack), prependExistingPrefix)
    }

    /**
     *
     * @param {function} routes
     * @private
     */
    _loadRoutes(routes) {
        if (isFunction(routes)) {
            routes(this)
        }
    }

    getLastGroupPrefix() {
        if (this.hasGroupStack()) {
            const last = end(this._groupStack)
            return last.prefix ?? ''
        }
        return ''
    }

    /**
     *
     * @param {string|string[]} methods
     * @param {string} uri
     * @param {function|Array|string|Object|null} action
     * @return void
     */
    addRoute(methods, uri, action) {
        this._addRoute(this._createRoute(methods, uri, action))
    }

    _addRoute(route) {
        throw new BadMethodCallException('Method not implemented.')
    }

    /**
     *
     * @param {string|string[]} methods
     * @param {string} uri
     * @param {function|Array|string|Object|null} action
     * @return {Route}
     */
    _createRoute(methods, uri, action) {
        if (this._actionReferencesController(action)) {
            action = this._convertToControllerAction(action)
        }

        const route = this.newRoute(
            methods, this._prefix(uri), action,
        )

        if (this.hasGroupStack()) {
            this._mergeGroupAttributesIntoRoute(route)
        }

        // TODO:

        return route
    }

    _actionReferencesController(action) {
        if (!isFunction(action)) {
            return isString(action) || (isObject(action) && isString(action.uses))
        }
        return false
    }

    /**
     *
     * @param {string|Object} action
     * @return {Object}
     * @private
     */
    _convertToControllerAction(action) {
        if (isString(action)) {
            action = {uses: action}
        }

        if (this.hasGroupStack()) {
            action.uses = this._prependGroupController(action.uses)
        }

        action.controller = action.uses

        return action
    }

    /**
     *
     * @param {string} method
     * @return {Array|string}
     * @private
     */
    _prependGroupController(method) {
        const group = end(this._groupStack)

        if (!isset(group['controller'])) {
            return method
        }

        return [group['controller'], method]
    }

    /**
     *
     * @param {string|string[]} methods
     * @param {string} uri
     * @param {function|Array|Object|null} action
     * @return {Route}
     */
    newRoute(methods, uri, action) {
        return new Route(methods, uri, action)
    }

    _prefix(uri) {
        uri = trim(trim(this.getLastGroupPrefix(), '/') + '/' + trim(uri, '/'), '/')
        return uri !== '' ? uri : '/'
    }

    /**
     *
     * @param {Route} route
     */
    _mergeGroupAttributesIntoRoute(route) {
        route.setAction(this.mergeWithLastGroup(
            route.getAction(),
            false,
        ))
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
     * @param {function[]} middleware
     * @return {AbstractRouter}
     */
    globalMiddleware(middleware) {
        throw new BadMethodCallException('Method not implemented.')
    }

    hasGroupStack() {
        return !empty(this._groupStack)
    }

    __call(method, ...parameters) {
        // TODO:

        if (method === 'middleware') {
            return new RouteRegistrar(this).attribute(method, isArray(parameters[0]) ? parameters[0] : parameters)
        }

        // TODO:

        return new RouteRegistrar(this).attribute(method, arrayKeyExists(0, parameters) ? parameters[0] : true)
    }
}

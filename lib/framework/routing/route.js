import {inArray} from '../../core/extensions/arrays/functions.js'
import {ltrim, rtrim, trim} from '../../core/extensions/strings/functions.js'
import {empty, isArray, isObject} from '../../core/extensions/variable-handling/functions.js'
import {Arr} from '../support/arr.js'
import {RouteAction} from './route-action.js'

export class Route
{
    /**
     * @type {string}
     */
    uri

    /**
     * @type {string[]}
     */
    methods

    /**
     * @type {Object}
     */
    action

    /**
     *
     * @param {string|string[]} methods
     * @param {string} uri
     * @param {function|Array|Object|null} action
     */
    constructor(methods, uri, action) {
        this.uri = uri
        this.methods = isArray(methods) ? methods : [methods]
        this.action = this._parseAction(action)

        if (inArray('GET', this.methods) && !inArray('HEAD', this.methods)) {
            this.methods.push('HEAD')
        }

        this.prefix(isObject(action) ? Arr.get(action, 'prefix') : '')
    }

    /**
     *
     * @param {function|Array|Object|null} action
     * @return {Object}
     * @private
     */
    _parseAction(action) {
        return RouteAction.parse(this.uri, action)
    }

    prefix(prefix) {
        prefix ??= ''

        this._updatePrefixOnAction(prefix)

        const uri = rtrim(prefix, '/') + '/' + ltrim(this.uri, '/')

        return this.setUri(uri !== '/' ? trim(uri, '/') : uri)
    }

    _updatePrefixOnAction(prefix) {
        const newPrefix = trim(rtrim(prefix, '/') + '/' + ltrim(this.action.prefix ?? '', '/'), '/')
        if (!empty(newPrefix)) {
            this.action.prefix = newPrefix
        }
    }

    setUri(uri) {
        this.uri = this._parseUri(uri)

        return this
    }

    _parseUri(uri) {
        // TODO: 
        return uri
    }

    getAction(key = null) {
        return Arr.get(this.action, key)
    }

    setAction(action) {
        this.action = action
        return this
    }
}

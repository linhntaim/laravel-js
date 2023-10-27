import {AbstractRouter} from './abstract-router.js'
import express from 'express'
import {magic} from '../../core/classes/magic.js'

export class __ExpressRouter extends AbstractRouter
{
    /**
     *
     * @type {Express}
     */
    _express

    constructor(events, container = null) {
        super(events, container)

        this._express = express()
    }

    addRoute(methods, uri, action) {
        let route = this._express.route(uri)
        methods.forEach(method => {
            route = route[method.toLowerCase()](action)
        })
    }

    dispatch() {
        return this._express
    }

    globalMiddleware(middleware) {
        middleware.forEach(mw => this._express.use(mw))
        return this
    }
}

export const ExpressRouter = magic(__ExpressRouter)

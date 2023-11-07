import express from 'express'
import magic from 'magic-class'
import {AbstractRouter} from './abstract-router.js'

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

    /**
     *
     * @param {Route} route
     */
    _addRoute(route) {
        console.log(route)
        route.methods.forEach(method => {
            this._express[method.toLowerCase()](
                route.uri.at(0) !== '/' ? `/${route.uri}` : route.uri,
                route.action.uses,
            )
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

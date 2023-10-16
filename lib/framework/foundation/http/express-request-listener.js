import {RequestListener} from '../../contracts/http/request-listener.js'
import express from 'express'

export class ExpressRequestListener extends RequestListener
{
    create(middleware = []) {
        return (app => {
            middleware.forEach(mw => app.use(mw))
            return app
        })(express())
    }
}

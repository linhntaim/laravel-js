import {Kernel as BaseKernel} from '../../lib/framework/foundation/http/kernel.js'
import logger from 'morgan'
import express from 'express'
import cookieParser from 'cookie-parser'

export class Kernel extends BaseKernel
{
    constructor(app) {
        super(app)

        this.middleware = [
            logger('dev'),
            express.json(),
            express.urlencoded({extended: false}),
            cookieParser(),
            express.static(this.app.publicPath()),
        ]
    }
}

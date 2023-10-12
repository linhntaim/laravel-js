import {Kernel as KernelContract} from '../../contracts/http/kernel.js'
import {BootProviders} from '../bootstrap/boot-providers.js'
import logger from 'morgan'
import express from 'express'
import cookieParser from 'cookie-parser'
import http from 'http'
import {LoadEnvironmentVariables} from '../bootstrap/load-environment-variables.js'
import {LoadConfiguration} from '../bootstrap/load-configuration.js'

export class Kernel extends KernelContract
{
    constructor(app) {
        super()

        /**
         * @var {Application}
         */
        this.app = app

        this.bootstrappers = [
            LoadEnvironmentVariables,
            LoadConfiguration,
            BootProviders,
        ]

        this.middlewares = [
            logger('dev'),
            express.json(),
            express.urlencoded({extended: false}),
            cookieParser(),
            express.static(app.getPublicPath()),
        ]
    }

    handle() {
        this.bootstrap()

        this.createServer()
    }

    bootstrap() {
        if (!this.app.hasBeenBootstrapped()) {
            this.app.bootstrapWith(this.bootstrappers)
        }
    }

    normalizePort(port) {
        try {
            port = Number.parseInt(port, 10)
        }
        catch (e) {
            throw 'Invalid port'
        }

        if (Number.isNaN(port) || port < 0) {
            throw 'Invalid port'
        }
        return port
    }

    createServer() {
        const port = this.normalizePort(this.app.make('config').get('app.port', 3000))

        const server = http.createServer(this.createRequestListener())
        server.listen(port)
        server.on('error', error => {
            if (error.syscall !== 'listen') {
                throw error
            }

            const bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges')
                    process.exit(1)
                    break
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use')
                    process.exit(1)
                    break
                default:
                    throw error
            }
        })
        server.on('listening', () => {
            const addr = server.address()
            const bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port

            console.log(`Listening to ${bind}`)
        })
    }

    createRequestListener() {
        return (app => {
            this.middlewares.forEach(middleware => app.use(middleware))
            return app
        })(express())
    }
}

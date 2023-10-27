import http from 'http'
import {BootProviders} from '../bootstrap/boot-providers.js'
import {Carbon} from '../../support/carbon.js'
import {Kernel as KernelContract} from '../../contracts/http/kernel.js'
import {LoadConfiguration} from '../bootstrap/load-configuration.js'
import {LoadEnvironmentVariables} from '../bootstrap/load-environment-variables.js'
import {RegisterFacades} from '../bootstrap/register-facades.js'
import {RegisterProviders} from '../bootstrap/register-providers.js'
import {Application as ApplicationContract} from '../../contracts/foundation/application.js'
import {AbstractRouter} from '../../routing/abstract-router.js'

export class Kernel extends KernelContract
{
    static __reflection__ = {
        constructorParams: [
            {
                name: 'app',
                type: ApplicationContract,
            },
            {
                name: 'router',
                type: AbstractRouter,
            },
        ],
    }

    /**
     * @type {ApplicationContract}
     */
    _app

    /**
     * @type {AbstractRouter}
     */
    _router

    _bootstrappers = [
        LoadEnvironmentVariables,
        LoadConfiguration,
        RegisterFacades,
        RegisterProviders,
        BootProviders,
    ]

    _middleware = []

    _middlewareSynced = false

    _requestStartedAt

    /**
     *
     * @param {ApplicationContract} app
     * @param {AbstractRouter} router
     */
    constructor(app, router) {
        super()

        this._app = app
        this._router = router
    }

    /**
     *
     * @return void
     */
    handle() {
        this._requestStartedAt = Carbon.now()

        this._sendRequestThroughRouter()
    }

    _sendRequestThroughRouter() {
        this.bootstrap()
        this._createServer()
    }

    bootstrap() {
        if (!this._app.hasBeenBootstrapped()) {
            this._app.bootstrapWith(this._bootstrappers)
        }
        if (!this._middlewareSynced) {
            this._syncMiddlewareToRouter()
        }
    }

    /**
     *
     * @param {number|string} value
     * @returns {number|string}
     */
    _normalizePort(value) {
        const port = Number.parseInt(value, 10)
        if (Number.isNaN(port)) {
            // named pipe
            return value
        }
        if (port < 0) {
            throw new TypeError('Invalid port')
        }
        return port
    }

    _createServer() {
        const port = this._normalizePort(this._app.make('config').get('app.port', 3000))

        const server = http.createServer(this._dispatchToRouter())
        server.listen(port)
        server.on('error', error => {
            if (error.syscall !== 'listen') {
                throw error
            }

            const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`
            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(`${bind} requires elevated privileges`)
                    process.exit(1)
                    break
                case 'EADDRINUSE':
                    console.error(`${bind} is already in use`)
                    process.exit(1)
                    break
                default:
                    throw error
            }
        })
        server.on('listening', () => {
            const addr = server.address()
            const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
            console.log(`Listening to ${bind}`)
        })
    }

    _dispatchToRouter() {
        return this._router.dispatch()
    }

    _syncMiddlewareToRouter() {
        this._middlewareSynced = true

        this._router.globalMiddleware(this._middleware)
    }
}

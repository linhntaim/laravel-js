import http from 'http'
import {BootProviders} from '../bootstrap/boot-providers.js'
import {Carbon} from '../../support/carbon.js'
import {Kernel as KernelContract} from '../../contracts/http/kernel.js'
import {LoadConfiguration} from '../bootstrap/load-configuration.js'
import {LoadEnvironmentVariables} from '../bootstrap/load-environment-variables.js'
import {RegisterFacades} from '../bootstrap/register-facades.js'
import {RegisterProviders} from '../bootstrap/register-providers.js'
import {Application as ApplicationContract} from '../../contracts/foundation/application.js'

export class Kernel extends KernelContract
{
    static __reflection__ = {
        constructorParams: [
            {
                name: 'app',
                type: ApplicationContract,
            },
        ],
    }

    /**
     * @type {ApplicationContract}
     */
    app

    bootstrappers = [
        LoadEnvironmentVariables,
        LoadConfiguration,
        RegisterFacades,
        RegisterProviders,
        BootProviders,
    ]

    middleware = []

    #requestStartedAt

    /**
     *
     * @param {ApplicationContract} app
     */
    constructor(app) {
        super()

        this.app = app
    }

    /**
     *
     * @param {RequestListener} requestListener
     */
    handle(requestListener) {
        this.#requestStartedAt = Carbon.now()

        this.bootstrap()
        this.createServer(requestListener)
    }

    bootstrap() {
        if (!this.app.hasBeenBootstrapped()) {
            this.app.bootstrapWith(this.bootstrappers)
        }
    }

    /**
     *
     * @param {number|string} value
     * @returns {number|string}
     */
    #normalizePort(value) {
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

    /**
     *
     * @param {RequestListener} requestListener
     */
    createServer(requestListener) {
        const port = this.#normalizePort(this.app.make('config').get('app.port', 3000))

        const server = http.createServer(requestListener.create(this.middleware))
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
}

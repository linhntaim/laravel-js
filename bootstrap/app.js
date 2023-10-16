import * as config from '../config/index.js'
import {fileURLToPath} from 'url'
import {Application} from '../lib/framework/foundation/application.js'
import {Kernel as HttpKernelContract} from '../lib/framework/contracts/http/kernel.js'
import {Kernel as HttpKernel} from '../app/http/kernel.js'
import {RequestListener as HttpRequestListenerContract} from '../lib/framework/contracts/http/request-listener.js'
import {ExpressRequestListener as HttpRequestListener} from '../lib/framework/foundation/http/express-request-listener.js'
import path from 'path'

export const app = (app => {
    app.instance('config', config)
    app.singleton(HttpKernelContract, HttpKernel)
    app.singleton(HttpRequestListenerContract, HttpRequestListener)
    return app
})(new Application(
    process.env.APP_BASE_PATH ?? path.dirname(
        path.dirname(fileURLToPath(import.meta.url)),
    ),
))

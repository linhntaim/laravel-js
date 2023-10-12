import * as config from '../config/index.js'
import {fileURLToPath} from 'url'
import {Application} from '../lib/foundation/application.js'
import {Kernel as HttpKernelContract} from '../lib/contracts/http/kernel.js'
import {Kernel as HttpKernel} from '../app/http/kernel.js'
import path from 'path'

export const app = (app => {
    app.instance('config', config)
    app.singleton(HttpKernelContract, HttpKernel)
    return app
})(new Application(
    path.dirname(
        path.dirname(fileURLToPath(import.meta.url)),
    ),
))

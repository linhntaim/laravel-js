import {app} from './bootstrap/app.js'
import {Kernel} from './lib/framework/contracts/http/kernel.js'
import {RequestListener} from './lib/framework/contracts/http/request-listener.js'

app.make(Kernel).handle(app.make(RequestListener))

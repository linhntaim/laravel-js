import {app} from './bootstrap/app.js'
import {Kernel} from './lib/framework/contracts/http/kernel.js'

app.make(Kernel).handle()

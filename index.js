import {app} from './bootstrap/app.js'
import {Kernel as KernelContract} from './lib/contracts/http/kernel.js'

app.make(KernelContract).handle()

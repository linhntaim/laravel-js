import {RouteServiceProvider} from '../app/providers/route-service-provider.js'
import {env} from '../lib/framework/support/helpers.js'
import {AppServiceProvider} from '../app/providers/app-service-provider.js'

export const app = () => ({
    debug: env('DEBUG', false),

    port: env('PORT', 3000),

    providers: [
        AppServiceProvider,
        RouteServiceProvider,
    ],
})

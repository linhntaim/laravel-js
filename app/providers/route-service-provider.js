import {App} from '../../lib/framework/support/facades/app.js'
import {RouteServiceProvider as ServiceProvider} from '../../lib/framework/foundation/support/providers/route-service-provider.js'

export class RouteServiceProvider extends ServiceProvider
{
    boot() {
        this.routes(() => {
            console.log(App.version())
        })
    }
}

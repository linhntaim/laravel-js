import {RouteServiceProvider as ServiceProvider} from '../../lib/framework/foundation/support/providers/route-service-provider.js'
import {Route} from '../../lib/framework/support/facades/route.js'

export class RouteServiceProvider extends ServiceProvider
{
    boot() {
        this.routes(() => {
            
        })
    }
}

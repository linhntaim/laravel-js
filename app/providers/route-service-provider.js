import {RouteServiceProvider as ServiceProvider} from '../../lib/framework/foundation/support/providers/route-service-provider.js'
import {api} from '../../routes/api.js'
import {web} from '../../routes/web.js'

export class RouteServiceProvider extends ServiceProvider
{
    boot() {
        this._routes(() => {
            api()
            web()
        })
    }
}

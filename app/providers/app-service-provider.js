import {ServiceProvider} from '../../lib/framework/support/service-provider.js'
import {App} from '../../lib/framework/support/facades/app.js'

export class AppServiceProvider extends ServiceProvider
{
    register() {

    }

    boot() {
        console.log(App.version())
    }
}

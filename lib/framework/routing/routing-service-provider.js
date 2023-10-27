import {ServiceProvider} from '../support/service-provider.js'
import {ExpressRouter} from './express-router.js'

export class RoutingServiceProvider extends ServiceProvider
{
    register() {
        this._registerRouter()
    }

    _registerRouter() {
        this._app.singleton('router', function (app) {
            return new ExpressRouter(app.make('events'), app)
        })
    }
}

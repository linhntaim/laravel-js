import {ServiceProvider} from '../support/service-provider.js'
import {Dispatcher} from './dispatcher.js'
import {Factory as QueueFactoryContract} from '../contracts/queue/factory.js'

export class EventServiceProvider extends ServiceProvider
{
    register() {
        this._app.singleton('events', app => {
            return new Dispatcher(app).setQueueResolver(() => {
                return app.make(QueueFactoryContract)
            })
        })
    }
}

import {Container} from '../container/container.js'
import {Dispatcher as DispatcherContract} from '../contracts/events/dispatcher.js'

export class Dispatcher extends DispatcherContract
{
    _container

    /**
     * @type {function}
     */
    _queueResolver

    constructor(container = null) {
        super()

        this._container = container ?? new Container()
    }

    dispatch(event, payload = [], halt = false) {
        const responses = []
        return halt ? null : responses
    }

    _resolveQueue() {
        return this._queueResolver()
    }

    /**
     *
     * @param {function} resolver
     * @return {Dispatcher}
     */
    setQueueResolver(resolver) {
        this._queueResolver = resolver

        return this
    }
}

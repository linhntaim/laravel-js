export class ServiceProvider
{
    /**
     * @type {Application}
     */
    _app

    _bootingCallbacks = []

    _bootedCallbacks = []

    /**
     *
     * @param {Application} app
     */
    constructor(app) {
        this._app = app
    }

    register() {
    }

    /**
     *
     * @param {function} callback
     */
    booting(callback) {
        this._bootingCallbacks.push(callback)
    }

    /**
     *
     * @param {function} callback
     */
    booted(callback) {
        this._bootedCallbacks.push(callback)
    }

    callBootingCallbacks() {
        let index = 0
        while (index < this._bootingCallbacks.length) {
            this._app.call(this._bootingCallbacks[index])
            ++index
        }
    }

    callBootedCallbacks() {
        let index = 0
        while (index < this._bootedCallbacks.length) {
            this._bootedCallbacks[index](this)
            ++index
        }
    }
}

export class ServiceProvider
{
    /**
     * @type {Application}
     */
    app

    #bootingCallbacks = []

    #bootedCallbacks = []

    /**
     *
     * @param {Application} app
     */
    constructor(app) {
        this.app = app
    }

    register() {
    }

    /**
     *
     * @param {Function} callback
     */
    booting(callback) {
        this.#bootingCallbacks.push(callback)
    }

    /**
     *
     * @param {Function} callback
     */
    booted(callback) {
        this.#bootedCallbacks.push(callback)
    }

    callBootingCallbacks() {
        let index = 0
        while (index < this.#bootingCallbacks.length) {
            this.app.call(this.#bootingCallbacks[index])
            ++index
        }
    }

    callBootedCallbacks() {
        let index = 0
        while (index < this.#bootedCallbacks.length) {
            this.#bootedCallbacks[index](this)
            ++index
        }
    }
}

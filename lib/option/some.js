import {OptionInterface} from './option-interface.js'

export class Some extends OptionInterface
{
    #value

    constructor(value) {
        super()

        this.#value = value
    }

    get() {
        return this.#value
    }

    getOrElse(def) {
        return this.#value
    }

    getOrCall(callback) {
        return this.#value
    }
}

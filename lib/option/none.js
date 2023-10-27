import {OptionInterface} from './option-interface.js'
import {RuntimeException} from '../core/extensions/spl/exceptions/runtime-exception.js'
import {isDeclared} from '../core/extensions/variable-handling/functions.js'

export class None extends OptionInterface
{
    /**
     * @type {None}
     */
    static #instance

    static create() {
        if (isDeclared(this.#instance)) {
            this.#instance = new None()
        }
        return this.#instance
    }

    get() {
        throw new RuntimeException('None has no value.')
    }
}

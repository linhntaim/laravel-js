import {isObject, isString} from '../variable-handling/functions.js'

export class Reflector
{
    /**
     *
     * @type {Object|string}
     */
    _reflection

    constructor(reflection) {
        if (isString(reflection)) {
            this._reflection = {name: reflection}
        }
        else if (isObject(reflection)) {
            this._reflection = reflection
            if (!('name' in reflection)) {
                this._reflection.name = ''
            }
        }
        else {
            this._reflection = {}
        }
    }

    get name() {
        return this._reflection.name
    }

    getName() {
        return this.name
    }

    toStaticObject() {
        return {
            name: this._reflection.name,
        }
    }
}

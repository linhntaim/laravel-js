import {Arr} from '../support/arr.js'

export class Repository
{
    constructor(items) {
        this.items = items
    }

    get(key, def = null) {
        return Arr.get(this.items, key, def)
    }
}

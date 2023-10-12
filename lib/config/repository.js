import {Obj} from '../support/obj.js'

export class Repository
{
    constructor(items) {
        this.items = items
    }

    get(key, def = null) {
        return Obj.get(this.items, key, def)
    }
}

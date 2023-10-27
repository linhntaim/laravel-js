import {magic} from './lib/core/classes/magic.js'

class __F
{
    stack = []

    insert(value) {
        this.stack.push(value)
        return this
    }

    __get(prop) {
        if (prop === 'push') {
            return v => this.insert(v)
        }
        return v => this.insert('__' + v)
    }
}

const F = magic(__F)

const f = new F
f.insert(0).push(1).push(2).go(3).go(4).push(5)

console.log(f.stack)

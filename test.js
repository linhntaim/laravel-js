// const F = magic(class
// {
//     #prefix
//
//     constructor(prefix = '') {
//         this.#prefix = prefix
//     }
//
//     static __get() {
//         return 'static::F'
//     }
//
//     __get() {
//         return `${this.#prefix}F`
//     }
//
//     __invoke() {
//         return `${this.#prefix}invoke`
//     }
// })

import {MagicMixin} from './lib/core/classes/magic.js'

const F = MagicMixin(class
{
    #prefix

    constructor(prefix = '') {
        this.#prefix = prefix
    }

    static __get() {
        return 'static::F'
    }

    __get() {
        return `${this.#prefix}F`
    }

    __invoke() {
        return `${this.#prefix}invoke`
    }
})

console.log(F.any)
console.log(F.__static.any)

console.log(F.__instance('instance1::').any)
console.log(F.__instance('instance2::')())

const f = new F('construct::')
console.log(f.any)
// console.log(f())

console.log(F.__singleton('singleton::').any)
console.log(F.__instance('instance1::').any)
console.log(F.__instance('instance2::')())

const fc = new F('construct::')
console.log(fc.any)
// console.log(fc())

import {Env} from './env.js'

export function env(key, def = null) {
    return Env.get(key, def)
}

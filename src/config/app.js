import {getEnv} from './env'

export const app = {
    debug: getEnv('DEBUG', false),
}

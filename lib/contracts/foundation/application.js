import {Container} from '../../container/container.js'

export class Application extends Container
{
    getBasePath(path = '') {
        return path
    }

    hasBeenBootstrapped() {
        return false
    }

    bootstrapWith() {
    }

    boot() {
    }
}

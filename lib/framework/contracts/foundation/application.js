import {Container} from '../../container/container.js'
import {BadMethodCallException} from '../../../core/extensions/spl/exceptions/bad-method-call-exception.js'

export class Application extends Container
{
    version() {
        throw new BadMethodCallException('Method not implemented.')
    }

    basePath(relPath = '') {
        throw new BadMethodCallException('Method not implemented.')
    }

    publicPath(relPath = '') {
        throw new BadMethodCallException('Method not implemented.')
    }

    registerConfiguredProviders() {
        throw new BadMethodCallException('Method not implemented.')
    }

    register(provider, force = false) {
        throw new BadMethodCallException('Method not implemented.')
    }

    registerDeferredProvider(provider, service = null) {
        throw new BadMethodCallException('Method not implemented.')
    }

    resolveProvider(provider) {
        throw new BadMethodCallException('Method not implemented.')
    }

    boot() {
        throw new BadMethodCallException('Method not implemented.')
    }

    booting(callback) {
        throw new BadMethodCallException('Method not implemented.')
    }

    booted(callback) {
        throw new BadMethodCallException('Method not implemented.')
    }

    bootstrapWith(bootstrappers) {
        throw new BadMethodCallException('Method not implemented.')
    }

    getProviders(provider) {
        throw new BadMethodCallException('Method not implemented.')
    }

    hasBeenBootstrapped() {
        throw new BadMethodCallException('Method not implemented.')
    }

    loadDeferredProviders() {
        throw new BadMethodCallException('Method not implemented.')
    }

    shouldSkipMiddleware() {
        throw new BadMethodCallException('Method not implemented.')
    }
}

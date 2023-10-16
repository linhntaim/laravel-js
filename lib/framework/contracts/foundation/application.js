import {Container} from '../../container/container.js'

export class Application extends Container
{
    version() {
        return null
    }

    basePath(relPath = '') {
        return relPath
    }

    publicPath(relPath = '') {
        return relPath
    }

    registerConfiguredProviders() {

    }

    register(provider, force = false) {
        return null
    }

    registerDeferredProvider(provider, service = null) {
    }

    resolveProvider(provider) {
        return null
    }

    boot() {
    }

    booting(callback) {

    }

    booted(callback) {

    }

    bootstrapWith(bootstrappers) {
    }

    getProviders(provider) {
        return []
    }

    hasBeenBootstrapped() {
        return false
    }

    loadDeferredProviders() {

    }

    shouldSkipMiddleware() {
        return false
    }
}

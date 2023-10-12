import {Application as ApplicationContract} from '../contracts/foundation/application.js'
import path from 'path'

export class Application extends ApplicationContract
{
    constructor(basePath) {
        super()

        this.publicPath = null
        this.basePath = basePath
        this.bindPathsInContainer()

        this.bootstrapped = false
        this.booted = false
        this.serviceProviders = []
        this.loadedProviders = new Map()
    }

    bindPathsInContainer() {
        this.instance('path.base', this.getBasePath())
        this.instance('path.public', this.getPublicPath())
    }

    getBasePath(relativePath = '') {
        return relativePath === '' ? this.basePath : path.join(this.basePath, relativePath)
    }

    getPublicPath(relativePath = '') {
        const publicPath = this.publicPath ?? path.join(this.basePath, 'public')
        return relativePath === '' ? publicPath : path.join(publicPath, relativePath)
    }

    usePublicPath(path) {
        this.publicPath = path
        this.instance('path.public', path)
        return this
    }

    hasBeenBootstrapped() {
        return this.bootstrapped
    }

    bootstrapWith(bootstrappers) {
        this.bootstrapped = true
        bootstrappers.forEach(bootstrapperClass => {
            this.make(bootstrapperClass).bootstrap(this)
        })
    }

    isBooted() {
        return this.booted
    }

    registerConfiguredProviders() {
        this.make('config').get('app.providers', []).forEach(providerClass => this.register(providerClass))
    }

    register(providerClass) {
        const provider = this.resolveProvider(providerClass)
        provider.register()
        this.markAsRegistered(provider, providerClass)
        if (this.isBooted()) {
            this.bootProvider(provider)
        }
        return provider
    }

    /**
     *
     * @param providerClass
     * @returns {ServiceProvider}
     */
    resolveProvider(providerClass) {
        return new providerClass(this)
    }

    markAsRegistered(provider, providerClass) {
        this.serviceProviders.push(provider)
        this.loadedProviders[providerClass] = true
    }

    boot() {
        if (this.isBooted()) {
            return
        }

        this.serviceProviders.forEach(provider => this.bootProvider(provider))

        this.booted = true
    }

    /**
     *
     * @param {ServiceProvider} provider
     */
    bootProvider(provider) {
        provider.callBootingCallbacks()
        if ('boot' in provider) {
            provider.boot()
        }
        provider.callBootedCallbacks()
    }
}

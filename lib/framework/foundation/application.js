import {Application as ApplicationContract} from '../contracts/foundation/application.js'
import {Container} from '../container/container.js'
import {Container as ContainerContract} from '../contracts/container/container.js'
import {DIRECTORY_SEPARATOR} from '../../core/extensions/streams/constants.js'
import {ServiceProvider} from '../support/service-provider.js'
import {isNull} from '../../core/extensions/variable-handling/functions.js'
import {ltrim, rtrim} from '../../core/extensions/strings/functions.js'
import {methodExists} from '../../core/extensions/objects/functions.js'

export class Application extends ApplicationContract
{
    static VERSION = '10.28.0'

    #basePath

    #hasBeenBootstrapped = false

    #booted = false

    #bootingCallbacks = []

    #bootedCallbacks = []

    #serviceProviders = []

    #loadedProviders = new Map()

    #deferredServices = {}

    #publicPath

    constructor(basePath = null) {
        super()

        if (basePath) {
            this.setBasePath(basePath)
        }

        this.#registerBaseBindings()
        this.#registerBaseServiceProviders()
        this.#registerCoreContainerAliases()
    }

    version() {
        return Application.VERSION
    }

    #registerBaseBindings() {
        Container.setInstance(this)

        this.instance('app', this)
        this.instance(Container, this)
        // TODO:
    }

    #registerBaseServiceProviders() {
        // TODO:
    }

    bootstrapWith(bootstrappers) {
        this.#hasBeenBootstrapped = true
        bootstrappers.forEach(bootstrapperClass => {
            // TODO: 
            this.make(bootstrapperClass).bootstrap(this)
            // TODO: 
        })
    }

    hasBeenBootstrapped() {
        return this.#hasBeenBootstrapped
    }

    setBasePath(basePath) {
        this.#basePath = rtrim(basePath, '\\/')
        this.#bindPathsInContainer()
        return this
    }

    #bindPathsInContainer() {
        this.instance('path.base', this.basePath())
        this.instance('path.public', this.publicPath())
    }

    basePath(relPath = '') {
        return this.joinPaths(this.#basePath, relPath)
    }

    publicPath(relPath = '') {
        return this.joinPaths(this.#publicPath ?? this.basePath('public'), relPath)
    }

    usePublicPath(path) {
        this.#publicPath = path
        this.instance('path.public', path)
        return this
    }

    joinPaths(basePath, relPath = '') {
        return basePath + (relPath != '' ? DIRECTORY_SEPARATOR + ltrim(relPath, DIRECTORY_SEPARATOR) : '')
    }

    registerConfiguredProviders() {
        // TODO:
        this.make('config').get('app.providers', []).forEach(provider => this.register(provider))
    }

    /**
     *
     * @param {Function|ServiceProvider} provider
     * @param {boolean} force
     * @returns {ServiceProvider}
     */
    register(provider, force = false) {
        const registered = this.getProvider(provider)
        if (!isNull(registered) && !force) {
            return registered
        }

        const instance = provider instanceof ServiceProvider ? provider : this.resolveProvider(provider)

        instance.register()
        if ('bindings' in instance) {
            for (const [key, value] of instance.bindings) {
                this.bind(key, value)
            }
        }
        if ('singletons' in instance) {
            for (const [key, value] of instance.singletons) {
                this.singleton(key, value)
            }
        }

        this.markAsRegistered(instance)

        if (this.isBooted()) {
            this.#bootProvider(instance)
        }
        return instance
    }

    /**
     *
     * @param {Function|ServiceProvider} provider
     * @returns {ServiceProvider|null}
     */
    getProvider(provider) {
        return this.getProviders(provider)[0] ?? null
    }

    /**
     *
     * @param {Function|ServiceProvider} provider
     * @returns {ServiceProvider[]}
     */
    getProviders(provider) {
        const providerClass = provider instanceof ServiceProvider ? provider.constructor : provider
        return this.#serviceProviders.filter(serviceProvider => serviceProvider instanceof providerClass)
    }

    /**
     *
     * @param {Function} provider
     * @returns {ServiceProvider}
     */
    resolveProvider(provider) {
        return new provider(this)
    }

    /**
     *
     * @param {ServiceProvider} provider
     */
    markAsRegistered(provider) {
        this.#serviceProviders.push(provider)
        this.#loadedProviders.set(provider.constructor, true)
    }

    loadDeferredProviders() {
        Object.keys(this.#deferredServices).forEach(service => this.loadDeferredProvider(service))

        this.#deferredServices = {}
    }

    /**
     *
     * @param {string} service
     */
    loadDeferredProvider(service) {
        if (!this.isDeferredService(service)) {
            return
        }
        const provider = this.#deferredServices[service]
        if (!this.#loadedProviders.has(provider)) {
            this.registerDeferredProvider(provider, service)
        }
    }

    /**
     *
     * @param {Function} provider
     * @param {string|null} service
     */
    registerDeferredProvider(provider, service = null) {
        if (service) {
            delete this.#deferredServices[service]
        }

        const instance = new provider(this)
        this.register(instance)

        if (!this.isBooted()) {
            this.booting(() => this.#bootProvider(instance))
        }
    }

    make(abstract, parameters = {}) {
        abstract = this.getAlias(abstract)
        this.#loadDeferredProviderIfNeeded(abstract)
        return super.make(abstract, parameters)
    }

    resolve(abstract, parameters = {}, raiseEvents = true) {
        abstract = this.getAlias(abstract)
        this.#loadDeferredProviderIfNeeded(abstract)
        return super.resolve(abstract, parameters, raiseEvents)
    }

    /**
     *
     * @param {string|Function} abstract
     */
    #loadDeferredProviderIfNeeded(abstract) {
        if (this.isDeferredService(abstract) && !(this.instances.has(abstract))) {
            this.loadDeferredProvider(abstract)
        }
    }

    bound(abstract) {
        return this.isDeferredService(abstract) || super.bound(abstract)
    }

    isBooted() {
        return this.#booted
    }

    boot() {
        if (this.isBooted()) {
            return
        }

        this.fireAppCallbacks(this.#bootingCallbacks)

        this.#serviceProviders.forEach(provider => this.#bootProvider(provider))

        this.#booted = true

        this.fireAppCallbacks(this.#bootedCallbacks)
    }

    /**
     *
     * @param {ServiceProvider} provider
     */
    #bootProvider(provider) {
        provider.callBootingCallbacks()

        if (methodExists(provider, 'boot')) {
            provider.boot()
        }

        provider.callBootedCallbacks()
    }

    /**
     *
     * @param {Function} callback
     */
    booting(callback) {
        this.#bootingCallbacks.push(callback)
    }

    /**
     *
     * @param {Function} callback
     */
    booted(callback) {
        this.#bootedCallbacks.push(callback)

        if (this.isBooted()) {
            callback(this)
        }
    }

    /**
     *
     * @param {Function[]} callbacks
     */
    fireAppCallbacks(callbacks) {
        let index = 0
        while (index < callbacks.length) {
            callbacks[index](this)
            ++index
        }
    }

    shouldSkipMiddleware() {
        return this.bound('middleware.disable')
            && this.make('middleware.disable') === true
    }

    isDeferredService(service) {
        return service in this.#deferredServices
    }

    #registerCoreContainerAliases() {
        for (const [key, aliases] of Object.entries({
            'app': [Application, ContainerContract, ApplicationContract],
            // TODO:
        })) {
            aliases.forEach(alias => this.alias(key, alias))
        }
    }
}

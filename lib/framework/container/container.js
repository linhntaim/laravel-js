import {Container as ContainerContract} from '../contracts/container/container.js'
import {LogicException} from '../../core/extensions/spl/exceptions/logic-exception.js'
import {empty, isNull} from '../../core/extensions/variable-handling/functions.js'
import {end} from '../../core/extensions/arrays/functions.js'
import {BindingResolutionException} from '../contracts/container/binding-resolution-exception.js'
import {ReflectionClass} from '../../core/extensions/reflection/reflection-class.js'

export class Container extends ContainerContract
{
    static #instance

    #resolved = new Map()

    #bindings = new Map()

    instances = new Map()

    #aliases = new Map()

    #abstractAliases = new Map()

    #buildStack = []

    #with = []

    contextual = new Map()

    #reboundCallbacks = new Map()

    /**
     *
     * @param {ContainerContract} container
     * @returns {null|ContainerContract}
     */
    static setInstance(container = null) {
        return this.#instance = container
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {boolean}
     */
    bound(abstract) {
        return this.#bindings.has(abstract)
            || this.instances.has(abstract)
            || this.isAlias(abstract)
    }

    has(name) {
        return this.bound(name)
    }

    resolved(abstract) {
        if (this.isAlias(abstract)) {
            abstract = this.getAlias(abstract)
        }

        return this.#resolved.has(abstract)
            || this.instances.has(abstract)
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {boolean}
     */
    isShared(abstract) {
        return this.instances.has(abstract)
            || (this.#bindings.has(abstract) && this.#bindings.get(abstract).shared === true)
    }

    isAlias(name) {
        return this.#aliases.has(name)
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Function|string|null} concrete
     * @param {boolean} shared
     */
    bind(abstract, concrete = null, shared = false) {
        this.#dropStaleInstances(abstract)

        if (isNull(concrete)) {
            concrete = abstract
        }

        if (!(concrete instanceof Function)) {
            if (concrete instanceof String) {
                concrete = concrete.valueOf()
            }
            if (typeof concrete !== 'string') {
                throw new TypeError('`concrete` must be of type `Function|string|null`')
            }
            concrete = this.#getClosure(abstract, concrete)
        }

        this.#bindings.set(abstract, {concrete, shared})

        if (this.resolved(abstract)) {
            this.#rebound(abstract)
        }
    }

    #getClosure(abstract, concrete) {
        return (container, parameters = {}) => {
            if (abstract === concrete) {
                return container.build(concrete)
            }
            return container.resolve(concrete, parameters, false)
        }
    }

    /**
     *
     * @param {string|Function} concrete
     * @param {string|Function} abstract
     * @param {Function} implementation
     */
    addContextualBinding(concrete, abstract, implementation) {
        if (!this.contextual.has(concrete)) {
            this.contextual.set(concrete, new Map())
        }
        this.contextual.get(concrete).set(this.getAlias(abstract), implementation)
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Function|string|null} concrete
     */
    singleton(abstract, concrete = null) {
        this.bind(abstract, concrete, true)
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {*} instance
     */
    instance(abstract, instance) {
        this.removeAbstractAlias(abstract)

        const isBound = this.bound(abstract)

        this.#aliases.delete(abstract)

        this.instances.set(abstract, instance)

        if (isBound) {
            this.#rebound(abstract)
        }

        return instance
    }

    removeAbstractAlias(searched) {
        if (!this.isAlias(searched)) {
            return
        }

        this.#abstractAliases.forEach((aliases, abstract) => {
            aliases.forEach((alias, index) => {
                if (alias === searched) {
                    this.#abstractAliases.get(abstract).splice(index, 1)
                }
            })
        })
    }

    alias(abstract, alias) {
        if (alias === abstract) {
            throw new LogicException('Cannot create an alias to itself')
        }

        this.#aliases.set(alias, abstract)

        if (!this.#abstractAliases.has(abstract)) {
            this.#abstractAliases.set(abstract, [])
        }
        this.#abstractAliases.get(abstract).push(alias)
    }

    #rebound(abstract) {
        const instance = this.make(abstract)

        this.#getReboundCallbacks(abstract).forEach(callback => callback(this, instance))
    }

    /**
     *
     * @param {Function} abstract
     * @returns {array}
     */
    #getReboundCallbacks(abstract) {
        return this.#reboundCallbacks.get(abstract) ?? []
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Object} parameters
     * @returns {*}
     */
    make(abstract, parameters = {}) {
        return this.resolve(abstract, parameters)
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Object} parameters
     * @param {boolean} raiseEvents
     * @returns {*}
     */
    resolve(abstract, parameters = {}, raiseEvents = true) {
        abstract = this.getAlias(abstract)

        if (raiseEvents) {
            // TODO: 
        }

        let concrete = this.#getContextualConcrete(abstract)
        const needsContextualBuild = !empty(parameters) || !isNull(concrete)

        if (this.instances.has(abstract) && !needsContextualBuild) {
            return this.instances.get(abstract)
        }

        this.#with.push(parameters)

        if (isNull(concrete)) {
            concrete = this.#getConcrete(abstract)
        }
        let object = this.#isBuildable(concrete, abstract)
            ? this.build(concrete)
            : this.make(concrete)

        // TODO:

        if (this.isShared(abstract) && !needsContextualBuild) {
            this.instances.set(abstract, object)
        }

        if (raiseEvents) {
            // TODO: 
        }

        this.#resolved.set(abstract, true)

        this.#with.pop()

        return object
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {string|Function}
     */
    #getConcrete(abstract) {
        if (this.#bindings.has(abstract)) {
            return this.#bindings.get(abstract).concrete
        }
        return abstract
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {Function|null}
     */
    #getContextualConcrete(abstract) {
        const binding = this.#findInContextualBindings(abstract)
        if (!isNull(binding)) {
            return binding
        }

        if (!this.#abstractAliases.has(abstract)) {
            return null
        }

        this.#abstractAliases.get(abstract).forEach(alias => {
            const binding = this.#findInContextualBindings(alias)
            if (!isNull(binding)) {
                return binding
            }
        })

        return null
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {Function|null}
     */
    #findInContextualBindings(abstract) {
        const latestConcrete = end(this.#buildStack)
        if (latestConcrete === false || !this.contextual.has(latestConcrete)) {
            return null
        }
        const contextual = this.contextual.get(latestConcrete)
        return contextual.has(abstract) ? contextual.get(abstract) : null
    }

    /**
     *
     * @param {Function} concrete
     * @param {string|Function} abstract
     * @returns {boolean}
     */
    #isBuildable(concrete, abstract) {
        return concrete === abstract || concrete instanceof Function
    }

    /**
     *
     * @param {string|Function} concrete
     * @returns {*}
     */
    build(concrete) {
        if (!(concrete instanceof Function)) {
            throw new BindingResolutionException(`Cannot build target [${concrete}].`)
        }

        try {
            // function
            return concrete(this, this.#getLastParameterOverride())
        }
        catch (e) {
            // class
            const reflector = ReflectionClass.createFrom(concrete)

            this.#buildStack.push(concrete)

            const constructor = reflector.getConstructor()

            if (!constructor.getNumberOfParameters()) {
                this.#buildStack.pop()

                return reflector.newInstanceArgs()
            }

            const dependencies = constructor.getParameters()

            try {
                const instances = this.#resolveDependencies(dependencies)

                this.#buildStack.pop()

                return reflector.newInstanceArgs(instances)
            }
            catch (e) {
                this.#buildStack.pop()

                throw e
            }
        }
    }

    /**
     *
     * @param {ReflectionParameter[]} dependencies
     * @returns {Array}
     */
    #resolveDependencies(dependencies) {
        const results = []
        dependencies.forEach(dependency => {
            if (this._hasParameterOverride(dependency)) {
                results.push(this._getParameterOverride(dependency))
                return
            }

            if (dependency.getType() instanceof Function) {
                results.push(this._resolveClass(dependency))
                return
            }
            // TODO:
            throw new BindingResolutionException(
                `Unresolvable dependency [${dependency.name}] in class ${dependency.getDeclaringClass().getName()}.`,
            )
        })
        return results
    }

    /**
     *
     * @param {ReflectionParameter} dependency
     * @returns {boolean}
     * @private
     */
    _hasParameterOverride(dependency) {
        return dependency.name in this.#getLastParameterOverride()
    }

    /**
     *
     * @param {ReflectionParameter} dependency
     * @returns {*}
     * @protected
     */
    _getParameterOverride(dependency) {
        return this.#getLastParameterOverride()[dependency.name]
    }

    /**
     *
     * @returns {Object}
     */
    #getLastParameterOverride() {
        return end(this.#with, {})
    }

    /**
     *
     * @param {ReflectionParameter} parameter
     * @returns {*}
     * @private
     */
    _resolveClass(parameter) {
        try {
            // TODO:
            return this.make(parameter.getType())
        }
        catch (e) {
            if (parameter.isDefaultValueAvailable()) {
                this.#with.pop()
                return parameter.getDefaultValue()
            }
            // TODO:
            throw e
        }
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {Function}
     */
    getAlias(abstract) {
        return this.isAlias(abstract)
            ? this.getAlias(this.#aliases.get(abstract))
            : abstract
    }

    #dropStaleInstances(abstract) {
        this.instances.delete(abstract)
        this.#aliases.delete(abstract)
    }
}

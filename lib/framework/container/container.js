import {Container as ContainerContract} from '../contracts/container/container.js'
import {LogicException} from '../../core/extensions/spl/exceptions/logic-exception.js'
import {empty, isFunction, isNull, isString} from '../../core/extensions/variable-handling/functions.js'
import {end} from '../../core/extensions/arrays/functions.js'
import {BindingResolutionException} from '../contracts/container/binding-resolution-exception.js'
import {ReflectionClass} from '../../core/extensions/reflection/reflection-class.js'
import {isSubclassOf} from '../../core/extensions/objects/functions.js'

export class Container extends ContainerContract
{
    static _instance

    _resolved = new Map()

    _bindings = new Map()

    _instances = new Map()

    _aliases = new Map()

    _abstractAliases = new Map()

    _buildStack = []

    _with = []

    contextual = new Map()

    _reboundCallbacks = new Map()

    _globalBeforeResolvingCallbacks = []

    _globalResolvingCallbacks = []

    _globalAfterResolvingCallbacks = []

    _beforeResolvingCallbacks = new Map()

    _resolvingCallbacks = new Map()

    _afterResolvingCallbacks = new Map()

    /**
     *
     * @param {ContainerContract} container
     * @returns {null|ContainerContract}
     */
    static setInstance(container = null) {
        return this._instance = container
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {boolean}
     */
    bound(abstract) {
        return this._bindings.has(abstract)
            || this._instances.has(abstract)
            || this.isAlias(abstract)
    }

    has(name) {
        return this.bound(name)
    }

    resolved(abstract) {
        if (this.isAlias(abstract)) {
            abstract = this.getAlias(abstract)
        }

        return this._resolved.has(abstract)
            || this._instances.has(abstract)
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {boolean}
     */
    isShared(abstract) {
        return this._instances.has(abstract)
            || (this._bindings.has(abstract) && this._bindings.get(abstract).shared === true)
    }

    isAlias(name) {
        return this._aliases.has(name)
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Function|string|null} concrete
     * @param {boolean} shared
     */
    bind(abstract, concrete = null, shared = false) {
        this._dropStaleInstances(abstract)

        if (isNull(concrete)) {
            concrete = abstract
        }

        if (!isFunction(concrete)) {
            if (!isString(concrete)) {
                throw new TypeError('`concrete` must be of type `Function|string|null`')
            }
            concrete = this._getClosure(abstract, concrete)
        }

        this._bindings.set(abstract, {concrete, shared})

        if (this.resolved(abstract)) {
            this._rebound(abstract)
        }
    }

    _getClosure(abstract, concrete) {
        return (container, parameters = {}) => {
            if (abstract === concrete) {
                return container.build(concrete)
            }
            return container._resolve(concrete, parameters, false)
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
        this._removeAbstractAlias(abstract)

        const isBound = this.bound(abstract)

        this._aliases.delete(abstract)

        this._instances.set(abstract, instance)

        if (isBound) {
            this._rebound(abstract)
        }

        return instance
    }

    _removeAbstractAlias(searched) {
        if (!this.isAlias(searched)) {
            return
        }

        this._abstractAliases.forEach((aliases, abstract) => {
            aliases.forEach((alias, index) => {
                if (alias === searched) {
                    this._abstractAliases.get(abstract).splice(index, 1)
                }
            })
        })
    }

    alias(abstract, alias) {
        if (alias === abstract) {
            throw new LogicException('Cannot create an alias to itself')
        }

        this._aliases.set(alias, abstract)

        if (!this._abstractAliases.has(abstract)) {
            this._abstractAliases.set(abstract, [])
        }
        this._abstractAliases.get(abstract).push(alias)
    }

    _rebound(abstract) {
        const instance = this.make(abstract)

        this._getReboundCallbacks(abstract).forEach(callback => callback(this, instance))
    }

    /**
     *
     * @param {Function} abstract
     * @returns {array}
     */
    _getReboundCallbacks(abstract) {
        return this._reboundCallbacks.get(abstract) ?? []
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Object} parameters
     * @returns {*}
     */
    make(abstract, parameters = {}) {
        return this._resolve(abstract, parameters)
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Object} parameters
     * @param {boolean} raiseEvents
     * @returns {*}
     */
    _resolve(abstract, parameters = {}, raiseEvents = true) {
        abstract = this.getAlias(abstract)

        if (raiseEvents) {
            this._fireBeforeResolvingCallbacks(abstract, parameters)
        }

        let concrete = this._getContextualConcrete(abstract)
        const needsContextualBuild = !empty(parameters) || !isNull(concrete)

        if (this._instances.has(abstract) && !needsContextualBuild) {
            return this._instances.get(abstract)
        }

        this._with.push(parameters)

        if (isNull(concrete)) {
            concrete = this._getConcrete(abstract)
        }
        let object = this._isBuildable(concrete, abstract)
            ? this.build(concrete)
            : this.make(concrete)

        // TODO:

        if (this.isShared(abstract) && !needsContextualBuild) {
            this._instances.set(abstract, object)
        }

        if (raiseEvents) {
            this._fireResolvingCallbacks(abstract, object)
        }

        this._resolved.set(abstract, true)

        this._with.pop()

        return object
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {string|Function}
     */
    _getConcrete(abstract) {
        if (this._bindings.has(abstract)) {
            return this._bindings.get(abstract).concrete
        }
        return abstract
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {Function|null}
     */
    _getContextualConcrete(abstract) {
        const binding = this._findInContextualBindings(abstract)
        if (!isNull(binding)) {
            return binding
        }

        if (!this._abstractAliases.has(abstract)) {
            return null
        }

        this._abstractAliases.get(abstract).forEach(alias => {
            const binding = this._findInContextualBindings(alias)
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
    _findInContextualBindings(abstract) {
        const latestConcrete = end(this._buildStack)
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
    _isBuildable(concrete, abstract) {
        return concrete === abstract || isFunction(concrete)
    }

    /**
     *
     * @param {string|Function} concrete
     * @returns {*}
     */
    build(concrete) {
        if (!isFunction(concrete)) {
            throw new BindingResolutionException(`Cannot build target [${concrete}].`)
        }

        try {
            // function
            return concrete(this, this._getLastParameterOverride())
        }
        catch (e) {
            // class
            const reflector = ReflectionClass.createFrom(concrete)

            this._buildStack.push(concrete)

            const constructor = reflector.getConstructor()

            if (!constructor.getNumberOfParameters()) {
                this._buildStack.pop()

                return reflector.newInstanceArgs()
            }

            const dependencies = constructor.getParameters()

            try {
                const instances = this._resolveDependencies(dependencies)

                this._buildStack.pop()

                return reflector.newInstanceArgs(instances)
            }
            catch (e) {
                this._buildStack.pop()

                throw e
            }
        }
    }

    /**
     *
     * @param {ReflectionParameter[]} dependencies
     * @returns {Array}
     */
    _resolveDependencies(dependencies) {
        const results = []
        dependencies.forEach(dependency => {
            if (this._hasParameterOverride(dependency)) {
                results.push(this._getParameterOverride(dependency))
                return
            }

            if (isFunction(dependency.getType())) {
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
        return dependency.name in this._getLastParameterOverride()
    }

    /**
     *
     * @param {ReflectionParameter} dependency
     * @returns {*}
     * @protected
     */
    _getParameterOverride(dependency) {
        return this._getLastParameterOverride()[dependency.name]
    }

    /**
     *
     * @returns {Object}
     */
    _getLastParameterOverride() {
        return end(this._with, {})
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
                this._with.pop()
                return parameter.getDefaultValue()
            }
            // TODO:
            throw e
        }
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Function|null} callback
     */
    beforeResolving(abstract, callback = null) {
        if (typeof abstract === 'string') {
            abstract = this.getAlias(abstract)
        }

        if (isFunction(abstract) && isNull(callback)) {
            this._globalBeforeResolvingCallbacks.push(abstract)
        }
        else {
            if (!this._beforeResolvingCallbacks.has(abstract)) {
                this._beforeResolvingCallbacks.set(abstract, [callback])
            }
            else {
                this._beforeResolvingCallbacks.get(abstract).push(callback)
            }
        }
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Function|null} callback
     */
    resolving(abstract, callback = null) {
        if (typeof abstract === 'string') {
            abstract = this.getAlias(abstract)
        }

        if (isFunction(abstract) && isNull(callback)) {
            this._globalResolvingCallbacks.push(abstract)
        }
        else {
            if (!this._resolvingCallbacks.has(abstract)) {
                this._resolvingCallbacks.set(abstract, [callback])
            }
            else {
                this._resolvingCallbacks.get(abstract).push(callback)
            }
        }
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Function|null} callback
     */
    afterResolving(abstract, callback = null) {
        if (typeof abstract === 'string') {
            abstract = this.getAlias(abstract)
        }

        if (isFunction(abstract) && isNull(callback)) {
            this._globalAfterResolvingCallbacks.push(abstract)
        }
        else {
            if (!this._afterResolvingCallbacks.has(abstract)) {
                this._afterResolvingCallbacks.set(abstract, [callback])
            }
            else {
                this._afterResolvingCallbacks.get(abstract).push(callback)
            }
        }
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Object} parameters
     */
    _fireBeforeResolvingCallbacks(abstract, parameters = {}) {
        this._fireBeforeCallbackArray(abstract, parameters, this._globalBeforeResolvingCallbacks)

        this._beforeResolvingCallbacks.forEach((callbacks, type) => {
            if (type === abstract || isSubclassOf(abstract, type)) {
                this._fireBeforeCallbackArray(abstract, parameters, callbacks)
            }
        })
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {Object} parameters
     * @param {Function[]} callbacks
     */
    _fireBeforeCallbackArray(abstract, parameters, callbacks) {
        callbacks.forEach(callback => {
            callback(abstract, parameters, this)
        })
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {*} object
     */
    _fireResolvingCallbacks(abstract, object) {
        this._fireCallbackArray(object, this._globalResolvingCallbacks)

        this._fireCallbackArray(
            object, this._getCallbacksForType(abstract, object, this._resolvingCallbacks),
        )

        this._fireAfterResolvingCallbacks(abstract, object)
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {*} object
     */
    _fireAfterResolvingCallbacks(abstract, object) {
        this._fireCallbackArray(object, this._globalAfterResolvingCallbacks)

        this._fireCallbackArray(
            object, this._getCallbacksForType(abstract, object, this._afterResolvingCallbacks),
        )
    }

    /**
     *
     * @param {string|Function} abstract
     * @param {*} object
     * @param {Map} callbacksPerType
     */
    _getCallbacksForType(abstract, object, callbacksPerType) {
        const results = []

        callbacksPerType.forEach((callbacks, type) => {
            if (type === abstract || object instanceof type) {
                results.push(...callbacks)
            }
        })

        return results
    }

    /**
     *
     * @param {*} object
     * @param {Function[]} callbacks
     */
    _fireCallbackArray(object, callbacks) {
        callbacks.forEach(callback => {
            callback(object, this)
        })
    }

    /**
     *
     * @param {string|Function} abstract
     * @returns {Function}
     */
    getAlias(abstract) {
        return this.isAlias(abstract)
            ? this.getAlias(this._aliases.get(abstract))
            : abstract
    }

    _dropStaleInstances(abstract) {
        this._instances.delete(abstract)
        this._aliases.delete(abstract)
    }
}

import {Container as ContainerContract} from '../contracts/container/container.js'

export class Container extends ContainerContract
{
    constructor() {
        super()

        this.bindings = new Map()
        this.instances = new Map()
    }

    instance(abstract, instance) {
        return this.instances[abstract] = instance
    }

    singleton(abstract, concrete = null) {
        this.bind(abstract, concrete, true)
    }

    bind(abstract, concrete = null, shared = false) {
        if (concrete === null) {
            concrete = abstract
        }
        if (!(concrete instanceof Function)) {
            shared = true
        }
        this.bindings[abstract] = {concrete, shared}
    }

    getConcrete(abstract) {
        if (abstract in this.bindings) {
            return this.bindings[abstract].concrete
        }
        return abstract
    }

    isShared(abstract) {
        return abstract in this.instances
            || (abstract in this.bindings && this.bindings[abstract].shared === true)
    }

    isBuildable(concrete, abstract) {
        return concrete === abstract || concrete instanceof Function
    }

    build(concrete, ...parameters) {
        if (concrete instanceof Function) {
            try {
                // function
                return concrete(this, ...parameters)
            }
            catch (e) {
                // class
                return new concrete(this, ...parameters)
            }
        }
        return concrete
    }

    make(abstract, ...parameters) {
        return this.resolve(abstract, ...parameters)
    }

    resolve(abstract, ...parameters) {
        if (abstract in this.instances) {
            return this.instances[abstract]
        }

        const concrete = this.getConcrete(abstract)
        const instance = this.isBuildable(concrete, abstract)
            ? this.build(concrete, ...parameters)
            : this.make(concrete, ...parameters)

        if (this.isShared(abstract)) {
            this.instances[abstract] = instance
        }

        return instance
    }
}

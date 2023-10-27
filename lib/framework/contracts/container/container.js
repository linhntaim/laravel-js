import {BadMethodCallException} from '../../../core/extensions/spl/exceptions/bad-method-call-exception.js'

export class Container
{
    bound(abstract) {
        throw new BadMethodCallException('Method not implemented.')
    }

    alias(abstract, alias) {
        throw new BadMethodCallException('Method not implemented.')
    }

    bind(abstract, concrete = null, shared = false) {
        throw new BadMethodCallException('Method not implemented.')
    }

    singleton(abstract, concrete = null) {
        throw new BadMethodCallException('Method not implemented.')
    }

    instance(abstract, instance) {
        throw new BadMethodCallException('Method not implemented.')
    }

    addContextualBinding(concrete, abstract, implementation) {
    }

    make(abstract, parameters = {}) {
        throw new BadMethodCallException('Method not implemented.')
    }

    call(callback, parameters = [], defaultMethod = null) {
        throw new BadMethodCallException('Method not implemented.')
    }

    resolved(abstract) {
        throw new BadMethodCallException('Method not implemented.')
    }

    beforeResolving(abstract, callback = null) {
        throw new BadMethodCallException('Method not implemented.')
    }

    resolving(abstract, callback = null) {
        throw new BadMethodCallException('Method not implemented.')
    }

    afterResolving(abstract, callback = null) {
        throw new BadMethodCallException('Method not implemented.')
    }
}

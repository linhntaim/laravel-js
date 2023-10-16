export class Container
{
    bound(abstract) {
        return false
    }

    alias(abstract, alias) {

    }

    bind(abstract, concrete = null, shared = false) {
    }

    singleton(abstract, concrete = null) {
    }

    instance(abstract, instance) {
        return null
    }

    addContextualBinding(concrete, abstract, implementation) {
    }

    make(abstract, parameters = {}) {
        return null
    }

    call(callback, parameters = [], defaultMethod = null) {
        return null
    }

    resolved(abstract) {
        return false
    }
}

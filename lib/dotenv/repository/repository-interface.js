import {BadMethodCallException} from '../../core/extensions/spl/exceptions/bad-method-call-exception.js'

export class RepositoryInterface
{
    get(name) {
        throw new BadMethodCallException('Method not implemented.')
    }
}

import {BadMethodCallException} from '../../../core/extensions/spl/exceptions/bad-method-call-exception.js'

export class Bootstrapper
{
    bootstrap(app) {
        throw new BadMethodCallException('Method not implemented.')
    }
}

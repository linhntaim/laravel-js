import {BadMethodCallException} from '../../../core/extensions/spl/exceptions/bad-method-call-exception.js'

export class Kernel
{
    /**
     *
     * @return void
     */
    handle() {
        throw new BadMethodCallException('Method not implemented.')
    }
}

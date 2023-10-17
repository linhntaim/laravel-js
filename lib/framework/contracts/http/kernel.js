import {BadMethodCallException} from '../../../core/extensions/spl/exceptions/bad-method-call-exception.js'

export class Kernel
{
    /**
     *
     * @param {RequestListener} requestListener
     */
    handle(requestListener) {
        throw new BadMethodCallException('Method not implemented.')
    }
}

import {BadMethodCallException} from '../../../core/extensions/spl/exceptions/bad-method-call-exception.js'

export class RequestListener
{
    /**
     *
     * @param {Array} middleware
     * @returns {*}
     */
    create(middleware = []) {
        throw new BadMethodCallException('Method not implemented.')
    }
}

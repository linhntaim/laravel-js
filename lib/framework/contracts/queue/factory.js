import {BadMethodCallException} from '../../../core/extensions/spl/exceptions/bad-method-call-exception.js'

export class Factory
{
    /**
     *
     * @param {string|null} name
     * @return {Queue}
     */
    connection(name = null) {
        throw new BadMethodCallException('Method not implemented.')
    }
}

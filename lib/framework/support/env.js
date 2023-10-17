import {Option} from '../../option/option.js'
import {value} from '../collection/helpers.js'

export class Env
{
    /**
     * @type {RepositoryInterface}
     * @private
     */
    static _repository

    static setRepository(repository) {
        this._repository = repository
    }

    static get(key, def = null) {
        return this._getOption(key).getOrCall(() => value(def))
    }

    /**
     *
     * @param {string} key
     * @returns {OptionInterface}
     * @private
     */
    static _getOption(key) {
        return Option.fromValue(this._repository.get(key))
    }
}

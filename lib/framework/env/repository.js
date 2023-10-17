import {RepositoryInterface} from '../../dotenv/repository/repository-interface.js'

export class Repository extends RepositoryInterface
{
    /**
     * @type {Object}
     * @private
     */
    _env

    constructor(env = {}) {
        super()

        this._env = env
    }

    /**
     *
     * @param {string} name
     * @returns {*}
     */
    get(name) {
        return this._env[name]
    }
}

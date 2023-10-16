import {Bootstrapper as BootstrapperContract} from '../../contracts/foundation/bootstrapper.js'

export class BootProviders extends BootstrapperContract
{
    /**
     *
     * @param {Application} app
     */
    bootstrap(app) {
        app.boot()
    }
}

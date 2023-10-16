import {Bootstrapper as BootstrapperContract} from '../../contracts/foundation/bootstrapper.js'

export class RegisterProviders extends BootstrapperContract
{
    bootstrap(app) {
        app.registerConfiguredProviders()
    }
}

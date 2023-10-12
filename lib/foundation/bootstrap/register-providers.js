import {Bootstrapper as BootstrapperContract} from '../../contracts/foundation/bootstrapper.js'

class RegisterProviders extends BootstrapperContract
{
    bootstrap(app) {
        app.registerConfiguredProviders()
    }
}

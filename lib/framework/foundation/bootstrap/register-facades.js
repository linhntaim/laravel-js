import {Bootstrapper as BootstrapperContract} from '../../contracts/foundation/bootstrapper.js'
import {__Facade} from '../../support/facades/facade.js'

export class RegisterFacades extends BootstrapperContract
{
    bootstrap(app) {
        __Facade.clearResolvedInstances()
        __Facade.setFacadeApplication(app)
    }
}

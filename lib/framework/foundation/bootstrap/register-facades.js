import {Bootstrapper as BootstrapperContract} from '../../contracts/foundation/bootstrapper.js'
import {Facade} from '../../support/facades/facade.js'

export class RegisterFacades extends BootstrapperContract
{
    bootstrap(app) {
        Facade.clearResolvedInstances()
        Facade.setFacadeApplication(app)
    }
}
    

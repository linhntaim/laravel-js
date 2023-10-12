import {Bootstrapper as BootstrapperContract} from '../../contracts/foundation/bootstrapper.js'
import dotenvPacked from 'dotenv-packed'

export class LoadEnvironmentVariables extends BootstrapperContract
{
    bootstrap(app) {
        app.instance('env', dotenvPacked.pack())
    }
}

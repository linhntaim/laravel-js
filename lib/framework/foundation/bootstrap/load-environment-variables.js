import {Bootstrapper as BootstrapperContract} from '../../contracts/foundation/bootstrapper.js'
import dotenvPacked from 'dotenv-packed'
import {Env} from '../../support/env.js'
import {Repository} from '../../env/repository.js'

export class LoadEnvironmentVariables extends BootstrapperContract
{
    bootstrap(app) {
        Env.setRepository(new Repository(dotenvPacked.pack().get()))
    }
}

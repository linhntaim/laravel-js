import {Bootstrapper as BootstrapperContract} from '../../contracts/foundation/bootstrapper.js'
import {Repository} from '../../config/repository.js'

export class LoadConfiguration extends BootstrapperContract
{
    bootstrap(app) {
        app.instance('config', (module => {
            const items = {}
            Object.keys(module).forEach(name => {
                items[name] = module[name] instanceof Function
                    ? module[name](app)
                    : module[name]
            })
            return new Repository(items)
        })(app.make('config')))
    }
}

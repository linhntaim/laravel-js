import {Bootstrapper as BootstrapperContract} from '../../contracts/foundation/bootstrapper.js'
import {Repository} from '../../config/repository.js'
import {isFunction} from '../../../core/extensions/variable-handling/functions.js'

export class LoadConfiguration extends BootstrapperContract
{
    bootstrap(app) {
        app.instance('config', (module => {
            const items = {}
            Object.keys(module).forEach(name => {
                items[name] = isFunction(module[name])
                    ? module[name](app)
                    : module[name]
            })
            return new Repository(items)
        })(app.make('config')))
    }
}

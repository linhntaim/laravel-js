import {Route} from '../lib/framework/support/facades/route.js'

export const web = () => {
    Route.get('/', (req, res) => {
        console.log('web')
        res.send('web')
    })
}

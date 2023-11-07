import {Route} from '../lib/framework/support/facades/route.js'

export const web = () => {
    Route.get('/', (req, res) => {
        res.send('Welcome to the Web')
    })
}

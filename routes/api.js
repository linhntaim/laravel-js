import {Route} from '../lib/framework/support/facades/route.js'

export const api = () => {
    Route.get('/', (req, res) => {
        res.send('Welcome to the API')
    })
}

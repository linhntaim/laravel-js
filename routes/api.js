import {Route} from '../lib/framework/support/facades/route.js'

export const api = () => {
    Route.get('/', (req, res) => {
        console.log('api')
        res.send('api')
    })
}

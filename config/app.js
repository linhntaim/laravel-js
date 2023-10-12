export const app = app => {
    const env = app.make('env')
    return {
        debug: env.get('DEBUG', false),

        port: env.get('PORT', 3000),

        providers: [],
    }
}

import dotenvPacked from 'dotenv-packed'

const {get} = dotenvPacked.pack()

export const env = get()

export const getEnv = get

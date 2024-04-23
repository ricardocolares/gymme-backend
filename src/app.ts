import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((err, _, reply) => {
    if (err instanceof ZodError) {
        return reply.status(400).send({ message: 'Validation error.', issues: err.format() })
    }

    if (env.NODE_ENV !== 'production') { console.error(err) } else {
        //TODO: WE SHOULD LOG TO AN EXTERNAL TOOL LIKE SENTRY
    }

    return reply.status(500).send({ message: 'Internal Server Error' })
})

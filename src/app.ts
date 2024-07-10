import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'

import { env } from './env'
import { errorHandler } from './error-handler'
import { accountRoutes } from './http/controllers/accounts/routes'
import { billsRoutes } from './http/controllers/bills/routes'
import { transactionsRoutes } from './http/controllers/transactions/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(fastifyCors, {
	origin: env.CLIENT_URL,
	credentials: true,
})

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		signed: false,
		cookieName: 'token',
	},
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(accountRoutes)
app.register(transactionsRoutes)
app.register(billsRoutes)

app.setNotFoundHandler((_, reply) => {
	return reply.status(404).send({ message: 'Rota não encontrada' })
})

app.setErrorHandler(errorHandler)

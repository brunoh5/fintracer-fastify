import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from '../env'
import { accountRoutes } from './controllers/accounts/routes'
import { billsRoutes } from './controllers/bills/routes'
import { transactionsRoutes } from './controllers/transactions/routes'
import { usersRoutes } from './controllers/users/routes'
import { errorHandler } from './error-handler'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
	origin: env.CLIENT_URL,
	credentials: true,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// @ts-ignore: Não sei como resolver
app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		signed: false,
		cookieName: 'token',
	},
})

app.register(fastifyCookie)

app.get('/health-check', (_, reply) => {
	return reply.status(200).send({ message: 'Hello World' })
})

app.register(usersRoutes)
app.register(accountRoutes)
app.register(transactionsRoutes)
app.register(billsRoutes)

app.setNotFoundHandler((_, reply) => {
	return reply.status(404).send({ message: 'Rota não encontrada' })
})

app.setErrorHandler(errorHandler)

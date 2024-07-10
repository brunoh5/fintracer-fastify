import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'
import { signOut } from './sign-out'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/users', register)
	app.post('/sessions', authenticate)

	app.get('/me', { onRequest: [verifyJWT] }, profile)
	app.get('/sign-out', { onRequest: [verifyJWT] }, signOut)
}

import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { create } from './create'
import { deleteAccount } from './delete'
import { edit } from './edit'
import { fetch } from './fetch'
import { get } from './get'

export async function accountRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT)

	app.post('/accounts', create)
	app.get('/accounts', fetch)

	app.get('/accounts/:id', get)
	app.delete('/accounts/:id', deleteAccount)
	app.put('/accounts/:id', edit)
}

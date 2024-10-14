import type { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { create } from './create'
import { fetch } from './fetch'
import { get } from './get'
import { pay } from './pay'

export async function billsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT)

	app.get('/bills', fetch)
	app.post('/bills', create)
	app.post('/bills/:billsId/pay', pay)
	app.post('/bills/:billsId', get)
}

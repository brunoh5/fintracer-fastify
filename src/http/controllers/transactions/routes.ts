import type { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { create } from './create'
import { deleteTransaction } from './delete'
import { edit } from './edit'
import { fetch } from './fetch'
import { get } from './get'
import { metrics } from './metrics'
import { monthlyExpensesByYear } from './monthly-expenses-by-year'

export async function transactionsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT)

	app.get('/transactions/monthly-expenses', monthlyExpensesByYear)
	app.get('/transactions/metrics', metrics)
	app.get('/transactions', fetch)
	app.post('/transactions', create)

	app.get('/transactions/:id', get)
	app.put('/transactions/:id', edit)
	app.delete('/transactions/:id', deleteTransaction)
}

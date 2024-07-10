import { createAccount } from '@lib/tests/create-account'
import { createAndAuthenticateUser } from '@lib/tests/create-user-and-authenticate'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Fetch Transactions (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch transactions', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const { account } = await createAccount(token)

		await request(app.server)
			.post('/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send({
				category: 'OTHERS',
				accountId: account.id,
				amount: 3500,
				shopName: 'KaBuM-01',
				transaction_type: 'DEBIT',
				payment_method: 'CREDIT_CARD',
				name: 'RTX 3060',
			})

		await request(app.server)
			.post('/transactions')
			.set('Authorization', `Bearer ${token}`)
			.send({
				category: 'OTHERS',
				accountId: account.id,
				amount: 3500,
				shopName: 'KaBuM-02',
				transaction_type: 'DEBIT',
				payment_method: 'CREDIT_CARD',
				name: 'RTX 3060',
			})

		const response = await request(app.server)
			.get(`/transactions/${account.id}/all`)
			.query({ page: 1 })
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.transactions).toEqual([
			expect.objectContaining({
				shopName: 'KaBuM-02',
			}),
			expect.objectContaining({
				shopName: 'KaBuM-01',
			}),
		])
	})
})

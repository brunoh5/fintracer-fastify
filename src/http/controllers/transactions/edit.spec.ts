import { createAccount } from '@lib/tests/create-account'
import { createAndAuthenticateUser } from '@lib/tests/create-user-and-authenticate'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Update Transaction (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to update a transaction', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const { account } = await createAccount(token)

		const transactionResponse = await request(app.server)
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

		const { id } = transactionResponse.body.transaction

		const response = await request(app.server)
			.put(`/transactions/${id}`)
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

		expect(response.statusCode).toEqual(200)
		expect(response.body.transaction).toEqual(
			expect.objectContaining({
				shopName: 'KaBuM-02',
			}),
		)
	})
})

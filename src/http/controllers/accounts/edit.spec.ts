import { createAndAuthenticateUser } from '@lib/tests/create-user-and-authenticate'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Update Account (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to update a account', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const accountResponse = await request(app.server)
			.post('/accounts')
			.set('Authorization', `Bearer ${token}`)
			.send({
				initialAmount: 3500,
				bank: 'bank-01',
				type: 'CURRENT_ACCOUNT',
				number: '1111 2222 3333 4444',
			})

		const { id } = accountResponse.body.account

		const response = await request(app.server)
			.put(`/accounts/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				initialAmount: 3500,
				bank: 'bank-02',
				type: 'CURRENT_ACCOUNT',
				number: '1111 2222 3333 4444',
			})

		expect(response.status).toEqual(200)
		expect(response.body.account).toEqual(
			expect.objectContaining({
				bank: 'bank-02',
			}),
		)
	})
})

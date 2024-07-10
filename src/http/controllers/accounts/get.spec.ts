import { createAndAuthenticateUser } from '@lib/tests/create-user-and-authenticate'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Get Account (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get a account', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const accountResponse = await request(app.server)
			.post('/accounts')
			.set('Authorization', `Bearer ${token}`)
			.send({
				initialAmount: 3500,
				bank: 'bank-02',
				type: 'CURRENT_ACCOUNT',
				number: '1111 2222 3333 4444',
			})

		const { id } = accountResponse.body.account

		const response = await request(app.server)
			.get(`/accounts/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(200)
		expect(response.body.account).toEqual(
			expect.objectContaining({ id: expect.any(String) }),
		)
	})
})

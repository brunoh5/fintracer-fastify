import { createAndAuthenticateUser } from '@lib/tests/create-user-and-authenticate'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Create Account (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a account', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const response = await request(app.server)
			.post('/accounts')
			.set('Authorization', `Bearer ${token}`)
			.send({
				initialAmount: 3500,
				bank: 'bank',
				type: 'CURRENT_ACCOUNT',
				number: '1111 2222 3333 4444',
			})

		expect(response.status).toEqual(201)
		expect(response.body.account).toEqual(
			expect.objectContaining({
				id: expect.any(String),
			}),
		)
	})
})

import { createAccount } from '@lib/tests/create-account'
import { createAndAuthenticateUser } from '@lib/tests/create-user-and-authenticate'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Delete Account (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to delete a account', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const { account } = await createAccount(token)

		const response = await request(app.server)
			.delete(`/accounts/${account.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.status).toEqual(204)
	})
})

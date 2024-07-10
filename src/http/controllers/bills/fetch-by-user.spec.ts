import { createAndAuthenticateUser } from '@lib/tests/create-user-and-authenticate'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Fetch Bills (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch bills', async () => {
		const { token } = await createAndAuthenticateUser(app)

		await request(app.server)
			.post('/bills')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'bills-01',
				description: 'api de pagamentos',
				imageUrl: null,
				amount: 3500,
				dueDate: new Date('12-20-2023'),
				lastCharge: null,
				paid_at: null,
			})

		await request(app.server)
			.post('/bills')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'bills-02',
				description: 'api de pagamentos',
				imageUrl: null,
				amount: 3500,
				dueDate: new Date('12-20-2023'),
				lastCharge: null,
				paid_at: null,
			})

		const response = await request(app.server)
			.get('/bills')
			.set('Authorization', `Bearer ${token}`)

		expect(response.statusCode).toEqual(200)
		expect(response.body.bills).toEqual([
			expect.objectContaining({
				title: 'bills-01',
			}),
			expect.objectContaining({
				title: 'bills-02',
			}),
		])
	})
})

import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { TransactionsRepository } from '@/repositories/transactions-repository'

import { FetchTransactionsUseCase } from './fetch-transactions'

let transactionsRepository: TransactionsRepository
let sut: FetchTransactionsUseCase

describe('Fetch Transactions Use Case', () => {
	beforeEach(async () => {
		transactionsRepository = new InMemoryTransactionsRepository()
		sut = new FetchTransactionsUseCase(transactionsRepository)

		await transactionsRepository.create({
			userId: 'user-01',
			category: 'OTHERS',
			accountId: 'account-01',
			amount: 3500,
			shopName: 'KaBuM-01',
			payment_method: 'CREDIT_CARD',
			name: 'RTX 3060',
		})

		await transactionsRepository.create({
			userId: 'user-01',
			category: 'OTHERS',
			accountId: 'account-01',
			amount: -3500,
			shopName: 'KaBuM-02',
			payment_method: 'CREDIT_CARD',
			name: 'RTX 3060',
		})
	})

	it('should be able to fetch transactions', async () => {
		const result = await sut.execute({
			userId: 'user-01',
		})

		expect(result.meta.totalCount).toEqual(2)
		expect(result.transactions).toEqual([
			expect.objectContaining({ shopName: 'KaBuM-01' }),
			expect.objectContaining({ shopName: 'KaBuM-02' }),
		])
	})

	it('should be able to fetch revenue transactions', async () => {
		const result = await sut.execute({
			userId: 'user-01',
			transaction_type: 'CREDIT',
		})

		expect(result.meta.totalCount).toEqual(1)
		expect(result.transactions).toEqual([
			expect.objectContaining({ amount: 3500 }),
		])
	})
})

import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { TransactionsRepository } from '@/repositories/transactions-repository'

import { UpdateTransactionUseCase } from './update-transaction'

let transactionsRepository: TransactionsRepository
let sut: UpdateTransactionUseCase

describe('Update Transaction UseCase', () => {
	beforeEach(() => {
		transactionsRepository = new InMemoryTransactionsRepository()
		sut = new UpdateTransactionUseCase(transactionsRepository)
	})

	it('should be able to update a transaction', async () => {
		const createdTransaction = await transactionsRepository.create({
			userId: 'user-01',
			category: 'OTHERS',
			accountId: 'account-01',
			amount: -3500,
			shopName: 'KaBuM-01',
			transaction_type: 'DEBIT',
			payment_method: 'CREDIT_CARD',
			name: 'RTX 3060',
		})

		const { transaction } = await sut.execute({
			id: createdTransaction.id,
			category: 'OTHERS',
			amount: -3500,
			shopName: 'KaBuM-02',
			payment_method: 'CREDIT_CARD',
			name: 'RTX 3060',
		})

		expect(transaction.shopName).toEqual('KaBuM-02')
	})
})

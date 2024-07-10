import { beforeEach, describe, expect, it } from 'vitest'

import { AccountsRepository } from '@/repositories/accounts-repository'
import { InMemoryAccountsRepository } from '@/repositories/in-memory/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { TransactionsRepository } from '@/repositories/transactions-repository'

import { DeleteTransactionUseCase } from './delete-transaction'

let transactionsRepository: TransactionsRepository
let accountsRepository: AccountsRepository
let sut: DeleteTransactionUseCase

describe('Delete Transaction UseCase', () => {
	beforeEach(async () => {
		transactionsRepository = new InMemoryTransactionsRepository()
		accountsRepository = new InMemoryAccountsRepository()
		sut = new DeleteTransactionUseCase(
			transactionsRepository,
			accountsRepository,
		)

		await accountsRepository.create({
			id: 'account-01',
			balance: 0,
			bank: 'bank',
			type: 'CURRENT_ACCOUNT',
			number: '1111 2222 3333 4444',
			userId: 'user-01',
		})
	})

	it('should be able to delete a transaction', async () => {
		const createdTransaction = await transactionsRepository.create({
			userId: 'user-id',
			category: 'OTHERS',
			accountId: 'account-01',
			amount: 3500,
			shopName: 'KaBuM',
			payment_method: 'CREDIT_CARD',
			name: 'RTX 3060',
		})

		await sut.execute({
			transactionId: createdTransaction.id,
		})

		const deleteTransaction = await transactionsRepository.findById(
			createdTransaction.id,
		)

		expect(deleteTransaction).toEqual(null)
	})
})

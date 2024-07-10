import { beforeEach, describe, expect, it } from 'vitest'

import { AccountsRepository } from '@/repositories/accounts-repository'
import { InMemoryAccountsRepository } from '@/repositories/in-memory/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { TransactionsRepository } from '@/repositories/transactions-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { CreateTransactionUseCase } from './create-transaction'

let transactionsRepository: TransactionsRepository
let accountsRepository: AccountsRepository
let sut: CreateTransactionUseCase

describe('Create Transactions UseCase', () => {
	beforeEach(async () => {
		transactionsRepository = new InMemoryTransactionsRepository()
		accountsRepository = new InMemoryAccountsRepository()
		sut = new CreateTransactionUseCase(
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

	it('should be able to create a transaction', async () => {
		const { transaction } = await sut.execute({
			userId: 'user-01',
			category: 'OTHERS',
			accountId: 'account-01',
			amount: 3500,
			shopName: 'KaBuM',
			transaction_type: 'DEBIT',
			payment_method: 'CREDIT_CARD',
			name: 'RTX 3060',
			date: new Date(),
		})

		expect(transaction.id).toEqual(expect.any(String))
	})

	it('should not be able to create a transaction with non-existent account', async () => {
		await expect(() =>
			sut.execute({
				userId: 'user-01',
				category: 'OTHERS',
				accountId: 'non-existent-account',
				amount: 3500,
				shopName: 'KaBuM',
				transaction_type: 'DEBIT',
				payment_method: 'CREDIT_CARD',
				name: 'RTX 3060',
				date: new Date(),
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})

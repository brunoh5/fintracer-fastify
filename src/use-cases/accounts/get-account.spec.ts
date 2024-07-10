import { beforeEach, describe, expect, it } from 'vitest'

import { AccountsRepository } from '@/repositories/accounts-repository'
import { InMemoryAccountsRepository } from '@/repositories/in-memory/in-memory-accounts-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetAccountUseCase } from './get-account'

let accountsRepository: AccountsRepository
let sut: GetAccountUseCase

describe('Get Account Use Case', () => {
	beforeEach(() => {
		accountsRepository = new InMemoryAccountsRepository()
		sut = new GetAccountUseCase(accountsRepository)
	})

	it('should be able to get a account', async () => {
		const createdAccount = await accountsRepository.create({
			balance: 3500,
			bank: 'bank',
			type: 'CURRENT_ACCOUNT',
			number: '1111 2222 3333 4444',
			userId: 'user-01',
		})

		const { account } = await sut.execute({ accountId: createdAccount.id })

		expect(account.id).toEqual(createdAccount.id)
	})

	it('should not be able to get a account with wrong id', async () => {
		await expect(() =>
			sut.execute({ accountId: 'not-existent-account' }),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})

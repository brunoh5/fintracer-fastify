import { beforeEach, describe, expect, it } from 'vitest'

import { AccountsRepository } from '@/repositories/accounts-repository'
import { InMemoryAccountsRepository } from '@/repositories/in-memory/in-memory-accounts-repository'

import { CreateAccountUseCase } from './create-account'

let accountsRepository: AccountsRepository
let sut: CreateAccountUseCase

describe('Create Account UseCase', () => {
	beforeEach(() => {
		accountsRepository = new InMemoryAccountsRepository()
		sut = new CreateAccountUseCase(accountsRepository)
	})

	it('should be able to create a account', async () => {
		const { account } = await sut.execute({
			balance: 0,
			bank: 'bank',
			type: 'CURRENT_ACCOUNT',
			number: '1111 2222 3333 4444',
			userId: 'user-01',
		})

		expect(account.id).toEqual(expect.any(String))
	})
})

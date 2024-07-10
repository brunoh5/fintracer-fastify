import { beforeEach, describe, expect, it } from 'vitest'

import { AccountsRepository } from '@/repositories/accounts-repository'
import { InMemoryAccountsRepository } from '@/repositories/in-memory/in-memory-accounts-repository'

import { DeleteAccountUseCase } from './delete-account'

let accountsRepository: AccountsRepository
let sut: DeleteAccountUseCase

describe('Delete Account UseCase', () => {
	beforeEach(() => {
		accountsRepository = new InMemoryAccountsRepository()
		sut = new DeleteAccountUseCase(accountsRepository)
	})

	it('should be able to delete a account', async () => {
		const createdAccount = await accountsRepository.create({
			balance: 3500,
			bank: 'bank-01',
			type: 'CURRENT_ACCOUNT',
			number: '1111 2222 3333 4444',
			userId: 'user-01',
		})

		await sut.execute(createdAccount.id)

		const deleteAccount = await accountsRepository.findById(createdAccount.id)

		expect(deleteAccount).toEqual(null)
	})
})

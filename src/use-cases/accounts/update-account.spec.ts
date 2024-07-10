import { beforeEach, describe, expect, it } from 'vitest'

import { AccountsRepository } from '@/repositories/accounts-repository'
import { InMemoryAccountsRepository } from '@/repositories/in-memory/in-memory-accounts-repository'

import { UpdateAccountUseCase } from './update-account'

let accountsRepository: AccountsRepository
let sut: UpdateAccountUseCase

describe('Update Account UseCase', () => {
	beforeEach(() => {
		accountsRepository = new InMemoryAccountsRepository()
		sut = new UpdateAccountUseCase(accountsRepository)
	})

	it('should be able to update a account', async () => {
		const createdAccount = await accountsRepository.create({
			balance: 3500,
			bank: 'bank-01',
			type: 'CURRENT_ACCOUNT',
			number: '1111 2222 3333 4444',
			userId: 'user-01',
		})

		const { account } = await sut.execute({
			accountId: createdAccount.id,
			bank: 'bank-02',
			type: 'CURRENT_ACCOUNT',
			number: '1111 2222 3333 4444',
		})

		expect(account.bank).toEqual('bank-02')
	})

	// it('should be able to update a account balance', async () => {
	// 	await sut.execute({
	// 		userId: 'user-01',
	// 		category: 'OTHERS',
	// 		accountId: 'account-01',
	// 		amount: 3500,
	// 		shopName: 'KaBuM',
	// 		transaction_type: 'DEBIT',
	// 		payment_method: 'CREDIT_CARD',
	// 		name: 'RTX 3060',
	// 		date: new Date(),
	// 	})

	// 	const account = (await accountsRepository.findById('account-01')) as Account

	// 	console.log(account)

	// 	expect(account.balance).toEqual(3500)
	// })
})

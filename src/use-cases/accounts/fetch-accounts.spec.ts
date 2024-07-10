import { beforeEach, describe, expect, it } from 'vitest'

import { AccountsRepository } from '@/repositories/accounts-repository'
import { InMemoryAccountsRepository } from '@/repositories/in-memory/in-memory-accounts-repository'

import { FetchAccountsUseCase } from './fetch-accounts'

let accountsRepository: AccountsRepository
let sut: FetchAccountsUseCase

describe('Fetch Accounts Use Case', () => {
	beforeEach(async () => {
		accountsRepository = new InMemoryAccountsRepository()
		sut = new FetchAccountsUseCase(accountsRepository)

		await accountsRepository.create({
			balance: 3500,
			bank: 'bank-01',
			type: 'CURRENT_ACCOUNT',
			number: '1111 2222 3333 4444',
			userId: 'user-01',
		})

		await accountsRepository.create({
			balance: 3500,
			bank: 'bank-02',
			type: 'CURRENT_ACCOUNT',
			number: '1111 2222 3333 4444',
			userId: 'user-01',
		})
	})

	it('should be able to fetch accounts', async () => {
		const { accounts } = await sut.execute({ userId: 'user-01', pageIndex: 0 })

		expect(accounts).toHaveLength(2)
		expect(accounts).toEqual([
			expect.objectContaining({ bank: 'bank-01' }),
			expect.objectContaining({ bank: 'bank-02' }),
		])
	})
})

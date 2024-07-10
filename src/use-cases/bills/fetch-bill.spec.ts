import { beforeEach, describe, expect, it } from 'vitest'

import { BillsRepository } from '@/repositories/bills-repository'
import { InMemoryBillsRepository } from '@/repositories/in-memory/in-memory-bills-repository'

import { FetchBillsUseCase } from './fetch-bills'

let billsRepository: BillsRepository
let sut: FetchBillsUseCase

describe('Fetch Accounts Use Case', () => {
	beforeEach(async () => {
		billsRepository = new InMemoryBillsRepository()
		sut = new FetchBillsUseCase(billsRepository)

		await billsRepository.create({
			amount: 3500,
			title: 'bill-01',
			description: 'Conta Corrente',
			userId: 'user-01',
			dueDate: '12-20-2023',
		})

		await billsRepository.create({
			amount: 3500,
			title: 'bill-02',
			description: 'Conta Corrente',
			userId: 'user-01',
			dueDate: '12-20-2023',
		})
	})

	it('should be able to fetch accounts', async () => {
		const { bills } = await sut.execute({ userId: 'user-01', pageIndex: 0 })

		expect(bills).toHaveLength(2)
		expect(bills).toEqual([
			expect.objectContaining({ title: 'bill-01' }),
			expect.objectContaining({ title: 'bill-02' }),
		])
	})
})

import { beforeEach, describe, expect, it } from 'vitest'

import { BillsRepository } from '@/repositories/bills-repository'
import { InMemoryBillsRepository } from '@/repositories/in-memory/in-memory-bills-repository'

import { CreateBillUseCase } from './create-bill'

let billsRepository: BillsRepository
let sut: CreateBillUseCase

describe('Create Bill UseCase', () => {
	beforeEach(() => {
		billsRepository = new InMemoryBillsRepository()
		sut = new CreateBillUseCase(billsRepository)
	})

	it('should be able to create a account', async () => {
		const { bill } = await sut.execute({
			amount: 3500,
			title: 'bank',
			description: 'Conta Corrente',
			userId: 'user-1',
			dueDate: '12-20-2023',
		})

		expect(bill.id).toEqual(expect.any(String))
	})
})

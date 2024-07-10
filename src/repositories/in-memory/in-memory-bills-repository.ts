import { Bill, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import {
	BillsRepository,
	FindManyBillsProps,
	FindManyBillsResponse,
} from '../bills-repository'

export class InMemoryBillsRepository implements BillsRepository {
	public items: Bill[] = []

	async findManyBills(
		data: FindManyBillsProps,
	): Promise<FindManyBillsResponse> {
		const bills = this.items.filter((item) => item.userId === data.userId)

		return {
			bills,
			billsCount: bills.length + 1,
			totalInCents: bills.reduce((acc, data) => {
				return acc + data.amount
			}, 0),
			billsStatus: {
				paidInCents: 0,
				notPaidInCents: 0,
			},
		}
	}

	async create(data: Prisma.BillUncheckedCreateInput) {
		const bill = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description ?? null,
			dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
			created_at: new Date(),
			amount: data.amount,
			paid_at: data.paid_at ? new Date(data.paid_at) : null,
			userId: data.userId,
			period: data.period ?? 'ONLY',
			paid_amount: data.paid_amount ?? null,
			payment_method: data.payment_method ?? 'MONEY',
		}

		this.items.push(bill)

		return bill
	}

	async findBillsByUserId(id: string) {
		return this.items.filter((item) => item.userId === id)
	}

	async findById(id: string) {
		const bill = this.items.find((item) => item.id === id)

		if (!bill) {
			return null
		}

		return bill
	}

	async update(id: string, data: Prisma.BillUpdateInput) {
		const rowIndex = this.items.findIndex((row) => row.id === id)
		const row = this.items[rowIndex]

		this.items[rowIndex] = Object.assign(row, data)

		return row
	}
}

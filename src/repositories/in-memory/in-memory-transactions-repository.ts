import { randomUUID } from 'node:crypto'

import { Prisma, Transaction } from '@prisma/client'

import {
	FindManyTransactionsProps,
	MonthExpensesResponse,
	TransactionsRepository,
	UserTransactionResponse,
} from '../transactions-repository'

export class InMemoryTransactionsRepository implements TransactionsRepository {
	public items: Transaction[] = []

	async update(id: string, data: Prisma.TransactionUpdateInput) {
		const rowIndex = this.items.findIndex((row) => row.id === id)
		const row = this.items[rowIndex]

		this.items[rowIndex] = Object.assign(row, data)

		return row
	}

	async delete(id: string) {
		const rowIndex = this.items.findIndex((row) => row.id === id)

		if (rowIndex <= -1) {
			throw new Error()
		}

		this.items.splice(rowIndex, 1)

		return this.items[rowIndex]
	}

	async findById(id: string) {
		const transactions = this.items.find((item) => item.id === id)

		if (!transactions) {
			return null
		}

		return transactions
	}

	async create(data: Prisma.TransactionUncheckedCreateInput) {
		const transaction = {
			id: data.id ?? randomUUID(),
			name: data.name,
			shopName: data.shopName ?? null,
			created_at: new Date(),
			amount: data.amount ?? 0,
			payment_method: data.payment_method ?? 'MONEY',
			category: data.category ?? 'OTHERS',
			accountId: data.accountId,
			userId: data.userId,
			date: new Date(String(data.date)) ?? new Date(),
		}

		this.items.push(transaction)

		return transaction
	}

	async monthlyExpensesMetricsByYear() {
		return [{ month: new Date(), total: 25000 }]
	}

	async findManyTransactions(
		data: FindManyTransactionsProps,
	): Promise<UserTransactionResponse> {
		const filteredTransactions = this.items.filter((transaction) => {
			const fromDate = data.from ? new Date(data.from) : new Date()
			const toDate = data.to ? new Date(data.to) : new Date()

			const matchesType =
				!data.transaction_type ||
				(data.transaction_type === 'CREDIT' && transaction.amount >= 0) ||
				(data.transaction_type === 'DEBIT' && transaction.amount < 0)

			return (
				matchesType &&
				(!data.userId || transaction.userId === data.userId) &&
				(!data.from ||
					(fromDate && transaction.date) ||
					transaction.created_at >= fromDate) &&
				(!data.to ||
					(toDate && transaction.date) ||
					transaction.created_at <= toDate) &&
				(!data.name || transaction.name.includes(data.name)) &&
				(!data.accountId || transaction.accountId === data.accountId) &&
				(!data.payment_method ||
					transaction.payment_method === data.payment_method) &&
				(!data.category || transaction.category === data.category)
			)
		})

		const totalExpenseInCents = filteredTransactions.reduce((acc, data) => {
			if (data.amount - 0) {
				return (acc += data.amount)
			} else {
				return acc
			}
		}, 0)

		const totalRevenueInCents = filteredTransactions.reduce((acc, data) => {
			if (data.amount + 0) {
				return (acc += data.amount)
			} else {
				return acc
			}
		}, 0)

		return {
			transactions: filteredTransactions,
			transactionsCount: filteredTransactions.length,
			transactionsStatus: {
				totalExpenseInCents,
				totalRevenueInCents,
			},
		}
	}

	monthExpenses(): Promise<MonthExpensesResponse[]> {
		throw new Error('Method not implemented')
	}
}

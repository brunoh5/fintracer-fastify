import { randomUUID } from 'node:crypto'

import { Account, Prisma } from '@prisma/client'

import {
	AccountsRepository,
	UpdateBalanceAccountRequest,
} from '../accounts-repository'

export class InMemoryAccountsRepository implements AccountsRepository {
	public items: Account[] = []

	async updateBalanceAccount({
		id,
		amount,
		type,
	}: UpdateBalanceAccountRequest) {
		const rowIndex = this.items.findIndex((row) => row.id === id)
		const row = this.items[rowIndex]

		if (type === 'DEBIT') {
			this.items[rowIndex].balance = row.balance - amount
		} else if (type === 'CREDIT') {
			this.items[rowIndex].balance = row.balance + amount
		}
	}

	async getBalanceByAccountId(id: string): Promise<number> {
		const rowIndex = this.items.findIndex((row) => row.id === id)
		const row = this.items[rowIndex]

		return row.balance
	}

	async delete(id: string) {
		const rowIndex = this.items.findIndex((row) => row.id === id)

		if (rowIndex <= -1) {
			throw new Error()
		}

		this.items.splice(rowIndex, 1)
	}

	async findManyByUserId(id: string) {
		const accounts = this.items.filter((item) => item.userId === id)

		const total = accounts.reduce((acc, account) => {
			return acc + account.balance / 100
		}, 0)

		return {
			accounts,
			total,
			accountsCount: accounts.length + 1,
		}
	}

	async findById(id: string) {
		const account = this.items.find((item) => item.id === id)

		if (!account) {
			return null
		}

		return account
	}

	async update(id: string, data: Prisma.AccountUpdateInput): Promise<Account> {
		const rowIndex = this.items.findIndex((row) => row.id === id)
		const row = this.items[rowIndex]

		this.items[rowIndex] = Object.assign(row, data)

		return row
	}

	async create(data: Prisma.AccountUncheckedCreateInput) {
		const account = {
			id: data.id ?? randomUUID(),
			balance: data.balance ?? 0,
			bank: data.bank,
			type: data.type ?? 'CURRENT_ACCOUNT',
			number: data.number ?? null,
			created_at: new Date(),
			userId: data.userId,
		}

		this.items.push(account)

		return account
	}
}

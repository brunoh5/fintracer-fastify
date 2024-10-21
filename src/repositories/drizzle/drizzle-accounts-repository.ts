import { db } from '@/db'
import { accounts } from '@/db/schema'
import type {
	Account,
	AccountsRepository,
	AccountsSummaryResponse,
	CreateOrUpdateAccountRequest,
} from '@repositories/accounts-repository'
import { ResourceNotFoundError } from '@useCases/errors/resource-not-found-error'
import { eq, sql } from 'drizzle-orm'

export class DrizzleAccountsRepository implements AccountsRepository {
	async updateBalanceAccount(id: string, amount: number): Promise<void> {
		const account = await this.findById(id)

		if (!account) {
			throw new ResourceNotFoundError()
		}

		await db
			.update(accounts)
			.set({ balance: account.balance + amount })
			.where(eq(accounts.id, id))
	}

	async delete(id: string): Promise<void> {
		await db.delete(accounts).where(eq(accounts.id, id))
	}

	async accountsSummary(userId: string): Promise<AccountsSummaryResponse> {
		const result = await db
			.select({
				accounts: sql /*sql*/<Account[]>`
					JSON_AGG(
						JSON_BUILD_OBJECT(
							'id', ${accounts.id},
							'bank', ${accounts.bank},
							'balance', ${accounts.balance},
							'type', ${accounts.type}
						)
					)
				`.as('accounts'),
				totalBalanceInCents: sql /*sql*/`
					(SELECT SUM(${accounts.balance}))
				`.mapWith(Number),
				totalAccounts: sql /*sql*/`
					(SELECT COUNT(*) FROM ${accounts})
				`.mapWith(Number),
			})
			.from(accounts)
			.where(eq(accounts.userId, userId))

		return result[0]
	}

	async findById(id: string): Promise<Account | null> {
		const [account] = await db
			.select({
				id: accounts.id,
				bank: accounts.bank,
				balance: accounts.balance,
				type: accounts.type,
			})
			.from(accounts)
			.where(eq(accounts.id, id))

		return account
	}

	async update({
		bank,
		id,
		type,
	}: CreateOrUpdateAccountRequest): Promise<Account> {
		if (!id) {
			throw new ResourceNotFoundError()
		}

		const [bankAccount] = await db
			.update(accounts)
			.set({
				bank,
				type,
			})
			.where(eq(accounts.id, id))

		return bankAccount
	}

	async create({
		bank,
		userId,
		type = 'CURRENT_ACCOUNT',
	}: CreateOrUpdateAccountRequest): Promise<Account> {
		if (!userId) {
			throw new ResourceNotFoundError()
		}

		const [account] = await db.insert(accounts).values({
			bank,
			userId,
			type,
		})

		return account
	}
}

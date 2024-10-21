export type Account = {
	id: string
	userId?: string
	bank: string
	balance: number
	type:
		| 'CURRENT_ACCOUNT'
		| 'MACHINE_ACCOUNT'
		| 'SAVINGS_ACCOUNT'
		| 'INVESTMENT_ACCOUNT'
}

export type CreateOrUpdateAccountRequest = {
	id?: string
	bank: string
	userId?: string
	type:
		| 'CURRENT_ACCOUNT'
		| 'MACHINE_ACCOUNT'
		| 'SAVINGS_ACCOUNT'
		| 'INVESTMENT_ACCOUNT'
}

export type AccountsSummaryResponse = {
	accounts: Account[]
	totalBalanceInCents: number
	totalAccounts: number
}

export interface AccountsRepository {
	updateBalanceAccount(id: string, amount: number): Promise<void>
	delete(id: string): Promise<void>
	accountsSummary(userId: string): Promise<AccountsSummaryResponse>
	findById(id: string): Promise<Account | null>
	create(data: CreateOrUpdateAccountRequest): Promise<Account>
	update(data: CreateOrUpdateAccountRequest): Promise<Account>
}

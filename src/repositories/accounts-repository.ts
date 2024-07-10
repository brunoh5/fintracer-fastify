import { Account, Prisma } from '@prisma/client'

interface FindManyByUserIdResponse {
	accounts: Account[]
	total: number
	accountsCount: number
}

export interface AccountsRepository {
	updateBalanceAccount(id: string, amount: number): Promise<void>
	delete(id: string): Promise<void>
	update(id: string, data: Prisma.AccountUpdateInput): Promise<Account>
	findManyByUserId(id: string): Promise<FindManyByUserIdResponse>
	findById(id: string): Promise<Account | null>
	create(data: Prisma.AccountUncheckedCreateInput): Promise<Account>
}

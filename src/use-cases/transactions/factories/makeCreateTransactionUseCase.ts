// import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'
// import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { DrizzleAccountsRepository } from '@repositories/drizzle/drizzle-accounts-repository'
import { DrizzleTransactionsRepository } from '@repositories/drizzle/drizzle-transactions-repository'
import { CreateTransactionUseCase } from '../create-transaction'

export function makeCreateTransactionUseCase() {
	// const transactionsRepository = new PrismaTransactionsRepository()
	// const accountsRepository = new PrismaAccountsRepository()
	const transactionsRepository = new DrizzleTransactionsRepository()
	const accountsRepository = new DrizzleAccountsRepository()
	const useCase = new CreateTransactionUseCase(
		transactionsRepository,
		accountsRepository
	)

	return useCase
}

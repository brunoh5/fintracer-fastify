// import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { DrizzleTransactionsRepository } from '@repositories/drizzle/drizzle-transactions-repository'
import { FetchCurrentExpenses } from '../fetch-current-expenses'

export function makeFetchCurrentExpenses() {
	// const transactionsRepository = new PrismaTransactionsRepository()
	const transactionsRepository = new DrizzleTransactionsRepository()
	const useCase = new FetchCurrentExpenses(transactionsRepository)

	return useCase
}

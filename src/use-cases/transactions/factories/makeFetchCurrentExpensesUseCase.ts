import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { FetchCurrentExpenses } from '../fetch-current-expenses'

export function makeFetchCurrentExpenses() {
	const transactionsRepository = new PrismaTransactionsRepository()
	const useCase = new FetchCurrentExpenses(transactionsRepository)

	return useCase
}

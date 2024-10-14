// import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { DrizzleTransactionsRepository } from '@repositories/drizzle/drizzle-transactions-repository'
import { FetchTransactionsUseCase } from '../fetch-transactions'

export function makeFetchTransactionsUseCase() {
	// const transactionsRepository = new PrismaTransactionsRepository()
	const transactionsRepository = new DrizzleTransactionsRepository()
	const useCase = new FetchTransactionsUseCase(transactionsRepository)

	return useCase
}

// import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { DrizzleTransactionsRepository } from '@repositories/drizzle/drizzle-transactions-repository'
import { GetTransactionUseCase } from '../get-transaction'

export function makeGetTransactionUseCase() {
	// const transactionsRepository = new PrismaTransactionsRepository()
	const transactionsRepository = new DrizzleTransactionsRepository()
	const useCase = new GetTransactionUseCase(transactionsRepository)

	return useCase
}

import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { GetTransactionUseCase } from '../get-transaction'

export function makeGetTransactionUseCase() {
	const transactionsRepository = new PrismaTransactionsRepository()
	const useCase = new GetTransactionUseCase(transactionsRepository)

	return useCase
}

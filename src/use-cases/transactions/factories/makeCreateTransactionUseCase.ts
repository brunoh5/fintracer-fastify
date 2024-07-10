import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'
import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { CreateTransactionUseCase } from '../create-transaction'

export function makeCreateTransactionUseCase() {
	const transactionsRepository = new PrismaTransactionsRepository()
	const accountsRepository = new PrismaAccountsRepository()
	const useCase = new CreateTransactionUseCase(
		transactionsRepository,
		accountsRepository,
	)

	return useCase
}

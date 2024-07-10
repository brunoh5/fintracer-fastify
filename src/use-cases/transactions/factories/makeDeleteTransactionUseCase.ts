import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'
import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { DeleteTransactionUseCase } from '../delete-transaction'

export function makeDeleteTransactionUseCase() {
	const transactionsRepository = new PrismaTransactionsRepository()
	const accountsRepository = new PrismaAccountsRepository()
	const useCase = new DeleteTransactionUseCase(
		transactionsRepository,
		accountsRepository,
	)

	return useCase
}

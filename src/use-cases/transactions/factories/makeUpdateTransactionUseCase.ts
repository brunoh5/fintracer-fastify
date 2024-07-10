import { PrismaAccountsRepository } from '@repositories/prisma/prisma-accounts-repository'
import { PrismaTransactionsRepository } from '@repositories/prisma/prisma-transactions-repository'

import { UpdateTransactionUseCase } from '../update-transaction'

export function makeUpdateTransactionUseCase() {
	const transactionsRepository = new PrismaTransactionsRepository()
	const accountsRepository = new PrismaAccountsRepository()
	const useCase = new UpdateTransactionUseCase(
		transactionsRepository,
		accountsRepository,
	)

	return useCase
}

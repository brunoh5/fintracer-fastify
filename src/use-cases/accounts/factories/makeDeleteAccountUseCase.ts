import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'
import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { DeleteAccountUseCase } from '../delete-account'

export function makeDeleteAccountUseCase() {
	const accountsRepository = new PrismaAccountsRepository()
	const transactionsRepository = new PrismaTransactionsRepository()
	const useCase = new DeleteAccountUseCase(
		accountsRepository,
		transactionsRepository,
	)

	return useCase
}

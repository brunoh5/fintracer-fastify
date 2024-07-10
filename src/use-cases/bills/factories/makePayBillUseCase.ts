import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'
import { PrismaBillsRepository } from '@/repositories/prisma/prisma-bills-repository'
import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { PayBillUseCase } from '../pay-bill'

export function makePayBillUseCase() {
	const billsRepository = new PrismaBillsRepository()
	const accountsRepository = new PrismaAccountsRepository()
	const transactionsRepository = new PrismaTransactionsRepository()
	const useCase = new PayBillUseCase(
		billsRepository,
		accountsRepository,
		transactionsRepository,
	)

	return useCase
}

import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'

import { GetAccountUseCase } from '../get-account'

export function makeGetAccountUseCase() {
	const accountsRepository = new PrismaAccountsRepository()
	const useCase = new GetAccountUseCase(accountsRepository)

	return useCase
}

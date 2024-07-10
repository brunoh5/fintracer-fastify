import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'

import { FetchAccountsUseCase } from '../fetch-accounts'

export function makeFetchAccountsUseCase() {
	const accountsRepository = new PrismaAccountsRepository()
	const useCase = new FetchAccountsUseCase(accountsRepository)

	return useCase
}

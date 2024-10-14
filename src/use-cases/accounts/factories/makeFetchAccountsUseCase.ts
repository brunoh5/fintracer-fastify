// import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'

import { DrizzleAccountsRepository } from '@repositories/drizzle/drizzle-accounts-repository'
import { FetchAccountsUseCase } from '../fetch-accounts'

export function makeFetchAccountsUseCase() {
	// const accountsRepository = new PrismaAccountsRepository()
	const accountsRepository = new DrizzleAccountsRepository()
	const useCase = new FetchAccountsUseCase(accountsRepository)

	return useCase
}

// import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'

import { DrizzleAccountsRepository } from '@repositories/drizzle/drizzle-accounts-repository'
import { GetAccountUseCase } from '../get-account'

export function makeGetAccountUseCase() {
	// const accountsRepository = new PrismaAccountsRepository()
	const accountsRepository = new DrizzleAccountsRepository()
	const useCase = new GetAccountUseCase(accountsRepository)

	return useCase
}

// import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'

import { DrizzleAccountsRepository } from '@repositories/drizzle/drizzle-accounts-repository'
import { CreateAccountUseCase } from '../create-account'

export function makeCreateAccountUseCase() {
	// const accountsRepository = new PrismaAccountsRepository()
	const accountsRepository = new DrizzleAccountsRepository()
	const useCase = new CreateAccountUseCase(accountsRepository)

	return useCase
}

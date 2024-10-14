// import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'

import { DrizzleAccountsRepository } from '@repositories/drizzle/drizzle-accounts-repository'
import { UpdateAccountUseCase } from '../update-account'

export function makeUpdateAccountUseCase() {
	// const accountsRepository = new PrismaAccountsRepository()
	const accountsRepository = new DrizzleAccountsRepository()
	const useCase = new UpdateAccountUseCase(accountsRepository)

	return useCase
}

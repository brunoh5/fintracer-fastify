// import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'

import { DrizzleAccountsRepository } from '@repositories/drizzle/drizzle-accounts-repository'
import { DeleteAccountUseCase } from '../delete-account'

export function makeDeleteAccountUseCase() {
	// const accountsRepository = new PrismaAccountsRepository()
	const accountsRepository = new DrizzleAccountsRepository()
	const useCase = new DeleteAccountUseCase(accountsRepository)

	return useCase
}

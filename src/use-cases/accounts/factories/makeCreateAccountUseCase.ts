import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'

import { CreateAccountUseCase } from '../create-account'

export function makeCreateAccountUseCase() {
	const accountsRepository = new PrismaAccountsRepository()
	const useCase = new CreateAccountUseCase(accountsRepository)

	return useCase
}

import { PrismaAccountsRepository } from '@/repositories/prisma/prisma-accounts-repository'

import { UpdateAccountUseCase } from '../update-account'

export function makeUpdateAccountUseCase() {
	const accountsRepository = new PrismaAccountsRepository()
	const useCase = new UpdateAccountUseCase(accountsRepository)

	return useCase
}

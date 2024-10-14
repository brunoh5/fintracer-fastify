// import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { DrizzleAccountsRepository } from '@repositories/drizzle/drizzle-accounts-repository'
import { DrizzleUsersRepository } from '@repositories/drizzle/drizzle-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
	const usersRepository = new DrizzleUsersRepository()
	const accountsRepository = new DrizzleAccountsRepository()
	// const usersRepository = new PrismaUsersRepository()
	const useCase = new RegisterUseCase(usersRepository, accountsRepository)

	return useCase
}

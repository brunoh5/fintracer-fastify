// import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { DrizzleUsersRepository } from '@repositories/drizzle/drizzle-users-repository'
import { GetProfileUseCase } from '../get-profile'

export function makeGetProfileUseCase() {
	const usersRepository = new DrizzleUsersRepository()
	// const usersRepository = new PrismaUsersRepository()
	const useCase = new GetProfileUseCase(usersRepository)

	return useCase
}

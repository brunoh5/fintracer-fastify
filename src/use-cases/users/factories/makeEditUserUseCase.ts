// import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { DrizzleUsersRepository } from '@repositories/drizzle/drizzle-users-repository'
import { EditUserUseCase } from '../edit-user'

export function makeEditUserUseCase() {
	const usersRepository = new DrizzleUsersRepository()
	// const usersRepository = new PrismaUsersRepository()
	const useCase = new EditUserUseCase(usersRepository)

	return useCase
}

// import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { DrizzleUsersRepository } from '@repositories/drizzle/drizzle-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
	const usersRepository = new DrizzleUsersRepository()
	// const usersRepository = new PrismaUsersRepository()
	const useCase = new AuthenticateUseCase(usersRepository)

	return useCase
}

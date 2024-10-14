import bcrypt from 'bcryptjs'

import type { User, UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFoundError } from '@useCases/errors/resource-not-found-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
	email: string
	password: string
}

interface AuthenticateUseCaseResponse {
	user: User
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new InvalidCredentialsError()
		}

		if (!user.passwordHash) {
			throw new ResourceNotFoundError()
		}

		const doesPasswordMatches = await bcrypt.compare(
			password,
			user.passwordHash
		)

		if (!doesPasswordMatches) {
			throw new InvalidCredentialsError()
		}

		return {
			user,
		}
	}
}

import { compare, hash } from 'bcryptjs'

import type { UsersRepository } from '@/repositories/users-repository'

import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface EditUserUseCaseRequest {
	userId: string
	current_password: string
	new_password: string
}

export class EditUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
		current_password,
		new_password,
	}: EditUserUseCaseRequest): Promise<void> {
		const user = await this.usersRepository.findById(userId)

		if (!user) {
			throw new ResourceNotFoundError()
		}

		if (!user.passwordHash) {
			throw new ResourceNotFoundError()
		}

		const isCurrentPasswordMatches = await compare(
			current_password,
			user?.passwordHash
		)

		if (!isCurrentPasswordMatches) {
			throw new InvalidCredentialsError()
		}

		const new_hashed_password = await hash(new_password, 6)

		await this.usersRepository.changeUserCredentials(
			userId,
			new_hashed_password
		)
	}
}

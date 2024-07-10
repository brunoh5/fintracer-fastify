import { compare, hash } from 'bcryptjs'

import { UsersRepository } from '@/repositories/users-repository'

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

		const isCurrentPasswordMatches = await compare(
			current_password,
			user.password_hash,
		)

		if (!isCurrentPasswordMatches) {
			throw new InvalidCredentialsError()
		}

		user.password_hash = await hash(new_password, 6)

		await this.usersRepository.update(user, user.id)
	}
}

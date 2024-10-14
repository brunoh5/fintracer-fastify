import type { User, UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class GetProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute(id: string): Promise<User | null> {
		const user = await this.usersRepository.findById(id)

		if (!user) {
			throw new ResourceNotFoundError()
		}

		return user
	}
}

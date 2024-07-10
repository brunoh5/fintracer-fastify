import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetProfileUseCase } from './get-profile'

let usersRepository: UsersRepository
let sut: GetProfileUseCase

describe('Get Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetProfileUseCase(usersRepository)
	})

	it('should be able to get user profile', async () => {
		const createdUser = await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6),
		})

		const user = await sut.execute(createdUser.id)

		expect(user?.name).toEqual('John Doe')
	})

	it('should not be able get user profile with wrong id', async () => {
		await expect(() => sut.execute('non-existent-id')).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		)
	})
})

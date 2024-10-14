import bcrypt from 'bcryptjs'

import type { User, UsersRepository } from '@/repositories/users-repository'

import type { AccountsRepository } from '@repositories/accounts-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface RegisterUseCaseRequest {
	name: string
	email: string
	password: string
}

interface RegisterUseCaseResponse {
	user: User
}

export class RegisterUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private accountsRepository: AccountsRepository
	) {}

	async execute({
		name,
		email,
		password,
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const password_hash = await bcrypt.hash(password, 6)

		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const user = await this.usersRepository.create({
			name,
			email,
			passwordHash: password_hash,
		})

		await this.accountsRepository.create({
			bank: 'Conta Inicial',
			userId: user.id,
			type: 'CURRENT_ACCOUNT',
		})

		return {
			user,
		}
	}
}

import { db } from '@/db'
import { users } from '@/db/schema'

import type {
	CreateOrUpdateUserRequest,
	User,
	UsersRepository,
} from '@repositories/users-repository'
import { ResourceNotFoundError } from '@useCases/errors/resource-not-found-error'
import { eq } from 'drizzle-orm'

export class DrizzleUsersRepository implements UsersRepository {
	async changeUserCredentials(id: string, passwordHash: string): Promise<void> {
		if (!id) {
			throw new ResourceNotFoundError()
		}

		await db
			.update(users)
			.set({
				passwordHash,
			})
			.where(eq(users.id, id))
	}

	async findById(id: string): Promise<User | null> {
		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				passwordHash: users.passwordHash,
			})
			.from(users)
			.where(eq(users.id, id))

		if (!user) {
			throw new ResourceNotFoundError()
		}

		return user
	}

	async findByEmail(email: string): Promise<User | null> {
		const result = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				passwordHash: users.passwordHash,
			})
			.from(users)
			.where(eq(users.email, email))

		return result[0]
	}
	async create({
		name,
		email,
		passwordHash,
	}: CreateOrUpdateUserRequest): Promise<User> {
		const [createdNewUser] = await db
			.insert(users)
			.values({
				name,
				email,
				passwordHash,
			})
			.returning({ id: users.id, name: users.name, email: users.email })

		return createdNewUser
	}
	async update({ id, name }: CreateOrUpdateUserRequest): Promise<User> {
		if (!id) {
			throw new ResourceNotFoundError()
		}

		const result = await db
			.update(users)
			.set({
				name,
			})
			.where(eq(users.id, id))
			.returning({ id: users.id, name: users.name, email: users.email })

		return result[0]
	}
}

import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
	async findById(id: string) {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		})

		return user
	}

	async findByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		})

		return user
	}

	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({
			data: {
				...data,
				accounts: {
					create: {
						bank: 'Conta Inicial',
						type: 'CURRENT_ACCOUNT',
					},
				},
			},
		})

		return user
	}

	async update(data: Prisma.UserUpdateInput, id: string) {
		await prisma.user.update({
			where: {
				id,
			},
			data,
		})
	}

	async delete(id: string) {
		await prisma.user.delete({
			where: {
				id,
			},
		})
	}
}

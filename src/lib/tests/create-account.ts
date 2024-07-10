import { prisma } from '@/lib/prisma'

export async function createAccount() {
	const account = await prisma.account.create({
		data: {
			userId: 'user-01',
			bank: 'bank-01',
			type: 'CURRENT_ACCOUNT',
			number: '1111 2222 3333 4444',
			balance: 3500,
		},
	})

	return {
		account,
	}
}

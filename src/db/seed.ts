import { fakerPT_BR as faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

import { client, db } from '.'

import { accounts, bills, transactions, users } from './schema'

async function seed() {
	await db.delete(transactions)
	await db.delete(bills)
	await db.delete(accounts)
	await db.delete(users)

	const usersResult = await db
		.insert(users)
		.values({
			name: faker.person.fullName(),
			email: 'bruno@fintracer.com.br',
			passwordHash: await hash('123456', 6),
			activeSubscription: true,
		})
		.returning()

	const userId = usersResult[0].id

	// const transactionCategoriesResult = await db
	// 	.insert(transactionCategories)
	// 	.values([
	// 		{
	// 			color: faker.color.rgb(),
	// 			userId,
	// 			title: faker.lorem.word(),
	// 		},
	// 		{
	// 			color: faker.color.rgb(),
	// 			userId,
	// 			title: faker.lorem.word(),
	// 		},
	// 	])
	// 	.returning({ id: transactionCategories.id })

	const bankAccountResult = await db
		.insert(accounts)
		.values({
			bank: faker.finance.accountName(),
			balance: Number(faker.finance.accountNumber(5)),
			type: 'CURRENT_ACCOUNT',
			userId,
		})
		.returning()

	const bankAccountId = bankAccountResult[0].id

	const transactionsToInsert: (typeof transactions.$inferInsert)[] = []

	for (let i = 0; i < 5; i++) {
		transactionsToInsert.push({
			accountId: bankAccountId,
			userId,
			name: faker.commerce.productName(),
			amount:
				Number(
					faker.commerce.price({
						max: 1000,
						dec: 0,
					})
				) * -1,
			// categoryId: faker.helpers.arrayElement(
			// 	transactionCategoriesResult.map(item => item.id)
			// ),
			category: 'OTHERS',
			paymentMethod: faker.helpers.arrayElement([
				'MONEY',
				'PIX',
				'CREDIT_CARD',
				'DEBIT_CARD',
				'BANK_TRANSFER',
			]),
			date: faker.date.recent({
				days: 365,
			}),
		})
	}

	for (let i = 0; i < 5; i++) {
		transactionsToInsert.push({
			accountId: bankAccountId,
			userId,
			name: faker.commerce.productName(),
			amount: Number(
				faker.commerce.price({
					max: 1000,
					dec: 0,
				})
			),
			// categoryId: faker.helpers.arrayElement(
			// 	transactionCategoriesResult.map(item => item.id)
			// ),
			category: 'OTHERS',
			paymentMethod: faker.helpers.arrayElement([
				'MONEY',
				'PIX',
				'CREDIT_CARD',
				'DEBIT_CARD',
				'BANK_TRANSFER',
			]),
			date: faker.date.recent({
				days: 90,
			}),
		})
	}

	await db.insert(transactions).values(transactionsToInsert)
}

seed().finally(() => {
	console.info('🌱 Database seeded successfully!')
	client.end()
})

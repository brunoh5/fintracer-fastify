import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	const result = await prisma.$executeRaw`
		UPDATE "transactions"
		SET amount = CASE
		WHEN transaction_type = 'DEBIT'
		THEN -amount
		ELSE amount
		END
		WHERE transaction_type = 'DEBIT' AND amount > 0
		OR transaction_type = 'CREDIT' AND amount < 0;
	`

	console.info(`Updated ${result} rows`)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})

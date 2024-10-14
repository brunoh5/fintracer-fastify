import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateDateColumn() {
	try {
		const result = await prisma.$executeRaw`
      UPDATE "transactions"
      SET "date" = "created_at"
      WHERE "date" IS NULL
    `

		console.info(`Updated ${result} rows.`)
	} catch (error) {
		console.error('Error updating date column:', error)
	} finally {
		await prisma.$disconnect()
	}
}

updateDateColumn()

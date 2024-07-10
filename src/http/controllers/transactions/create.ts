import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateTransactionUseCase } from '@/use-cases/transactions/factories/makeCreateTransactionUseCase'

export async function create(req: FastifyRequest, reply: FastifyReply) {
	const createTransactionBodySchema = z.object({
		accountId: z.string().uuid(),
		name: z.string(),
		shopName: z.string().optional(),
		amount: z.coerce.number(),
		date: z.coerce.date().optional(),
		category: z.enum([
			'HOME',
			'FOOD',
			'TRANSPORTATION',
			'OTHERS',
			'ENTERTAINMENT',
			'SHOPPING',
		]),
		payment_method: z.enum([
			'MONEY',
			'PIX',
			'CREDIT_CARD',
			'DEBIT_CARD',
			'BANK_TRANSFER',
		]),
	})

	const { accountId, category, name, shopName, amount, payment_method, date } =
		createTransactionBodySchema.parse(req.body)

	const createTransactionUseCase = makeCreateTransactionUseCase()

	const { transaction } = await createTransactionUseCase.execute({
		accountId,
		category,
		name,
		shopName,
		amount,
		payment_method,
		date: date ?? new Date(),
		userId: req.user.sub,
	})

	return reply.status(201).send({ transaction })
}

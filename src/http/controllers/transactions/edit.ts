import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateTransactionUseCase } from '@/use-cases/transactions/factories/makeUpdateTransactionUseCase'

export async function edit(req: FastifyRequest, reply: FastifyReply) {
	const editParamsSchema = z.object({
		id: z.string(),
	})

	const editBodySchema = z.object({
		accountId: z.string(),
		name: z.string(),
		shopName: z.any().optional(),
		amount: z.coerce.number(),
		created_at: z.string().optional(),
		date: z.coerce.date().optional(),
		category: z
			.enum([
				'HOME',
				'FOOD',
				'TRANSPORTATION',
				'OTHERS',
				'ENTERTAINMENT',
				'SHOPPING',
			])
			.default('OTHERS'),
		payment_method: z
			.enum(['MONEY', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER'])
			.default('MONEY'),
	})

	const { category, name, amount, payment_method, date } = editBodySchema.parse(
		req.body
	)
	const { id } = editParamsSchema.parse(req.params)

	const updateTransactionUseCase = makeUpdateTransactionUseCase()

	const { transaction } = await updateTransactionUseCase.execute({
		id,
		category,
		name,
		amount,
		payment_method,
		date: date ? date : new Date(),
	})

	return reply.status(200).send({ transaction })
}

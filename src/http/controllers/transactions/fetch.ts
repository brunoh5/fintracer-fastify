import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchTransactionsUseCase } from '@/use-cases/transactions/factories/makeFetchTransactionsUseCase'

export async function fetch(req: FastifyRequest, reply: FastifyReply) {
	const fetchTransactionQuerySchema = z.object({
		pageIndex: z.coerce.number().default(0).optional(),
		accountId: z.string().optional(),
		name: z.string().optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		type: z.enum(['revenue', 'expense']).optional(),
		category: z
			.enum([
				'HOME',
				'FOOD',
				'TRANSPORTATION',
				'OTHERS',
				'ENTERTAINMENT',
				'SHOPPING',
			])
			.optional(),
		payment_method: z
			.enum(['MONEY', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER'])
			.optional(),
	})

	const {
		pageIndex = 0,
		accountId,
		name,
		category,
		payment_method,
		from,
		to,
		type,
	} = fetchTransactionQuerySchema.parse(req.query)

	const fetchTransactionUseCase = makeFetchTransactionsUseCase()

	const result = await fetchTransactionUseCase.execute({
		userId: req.user.sub,
		name,
		pageIndex,
		accountId,
		category,
		payment_method,
		from,
		to,
		type,
	})

	return reply.status(200).send(result)
}

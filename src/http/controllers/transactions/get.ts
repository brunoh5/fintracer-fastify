import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetTransactionUseCase } from '@/use-cases/transactions/factories/makeGetTransactionUseCase'

export async function get(req: FastifyRequest, reply: FastifyReply) {
	const getTransactionParamsSchema = z.object({
		id: z.string().uuid(),
	})

	const { id } = getTransactionParamsSchema.parse(req.params)

	const getTransactionUseCase = makeGetTransactionUseCase()

	const { transaction } = await getTransactionUseCase.execute({
		transactionId: id,
	})

	return reply.status(200).send({ transaction })
}

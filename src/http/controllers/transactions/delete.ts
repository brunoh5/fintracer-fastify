import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeDeleteTransactionUseCase } from '@/use-cases/transactions/factories/makeDeleteTransactionUseCase'

export async function deleteTransaction(
	req: FastifyRequest,
	reply: FastifyReply,
) {
	const deleteTransactionParamsSchema = z.object({
		id: z.string().uuid(),
	})

	const { id } = deleteTransactionParamsSchema.parse(req.params)

	const deleteTransactionUseCase = makeDeleteTransactionUseCase()

	const { transaction } = await deleteTransactionUseCase.execute({
		transactionId: id,
	})

	return reply.status(200).send({ transaction })
}

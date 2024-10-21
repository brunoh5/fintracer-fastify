import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetBillUseCase } from '@useCases/bills/factories/makeGetBillUseCase'

export async function get(req: FastifyRequest, reply: FastifyReply) {
	const getBillParamsSchema = z.object({
		billId: z.string(),
	})

	const { billId } = getBillParamsSchema.parse(req.params)

	const getBillUseCase = makeGetBillUseCase()

	const bill = await getBillUseCase.execute({
		billId,
	})

	return reply.status(200).send({ bill })
}

import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchBillUseCase } from '@useCases/bills/factories/makeFetchBillsUseCase'

export async function fetch(req: FastifyRequest, reply: FastifyReply) {
	const fetchBillsQuerySchema = z.object({
		pageIndex: z.coerce.number().default(0),
		title: z.string().optional(),
		status: z.string().optional(),
	})

	const {
		pageIndex = 0,
		title,
		status,
	} = fetchBillsQuerySchema.parse(req.query)

	const fetchBillsUseCase = makeFetchBillUseCase()

	const result = await fetchBillsUseCase.execute({
		pageIndex,
		title,
		status,
		userId: req.user.sub,
	})

	return reply.status(200).send(result)
}

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makePayBillUseCase } from '@useCases/bills/factories/makePayBillUseCase'

export async function pay(req: FastifyRequest, reply: FastifyReply) {
	const payBillParamsSchema = z.object({
		billId: z.string().uuid(),
	})

	const { billId } = payBillParamsSchema.parse(req.params)

	const payBillBodySchema = z.object({
		accountId: z.string(),
		paid_at: z.string().optional(),
		paid_amount: z.number().optional(),
	})

	const { accountId, paid_at, paid_amount } = payBillBodySchema.parse(req.body)

	const payBillUseCase = makePayBillUseCase()

	await payBillUseCase.execute({
		userId: req.user.sub,
		billId,
		accountId,
		paid_at: paid_at ?? new Date(),
		paid_amount,
	})

	return reply.status(204).send()
}

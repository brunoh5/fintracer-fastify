import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makePayBillUseCase } from '@useCases/bills/factories/makePayBillUseCase'

export async function pay(req: FastifyRequest, reply: FastifyReply) {
	const payBillParamsSchema = z.object({
		billId: z.string(),
	})

	const { billId } = payBillParamsSchema.parse(req.params)

	const payBillBodySchema = z.object({
		accountId: z.string(),
		paid_at: z.string().optional(),
		paid_amount: z.number().optional(),
		paymentMethod: z.enum([
			'MONEY',
			'PIX',
			'CREDIT_CARD',
			'DEBIT_CARD',
			'BANK_TRANSFER',
		]),
	})

	const { accountId, paid_at, paid_amount, paymentMethod } =
		payBillBodySchema.parse(req.body)

	const payBillUseCase = makePayBillUseCase()

	await payBillUseCase.execute({
		userId: req.user.sub,
		billId,
		accountId,
		paid_at: paid_at ?? new Date(),
		paid_amount,
		payment_method: paymentMethod,
	})

	return reply.status(204).send()
}

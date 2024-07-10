import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateAccountUseCase } from '@useCases/accounts/factories/makeCreateAccountUseCase'

export async function create(req: FastifyRequest, reply: FastifyReply) {
	const createAccountBodySchema = z.object({
		type: z
			.enum([
				'CURRENT_ACCOUNT',
				'INVESTMENT_ACCOUNT',
				'SAVINGS_ACCOUNT',
				'MACHINE_ACCOUNT',
			])
			.default('CURRENT_ACCOUNT'),
		bank: z.string(),
		number: z.string().optional(),
		initialAmount: z.number().default(0),
	})

	const { type, bank, number, initialAmount } = createAccountBodySchema.parse(
		req.body,
	)

	const createAccountUseCase = makeCreateAccountUseCase()

	const { account } = await createAccountUseCase.execute({
		type,
		bank,
		number,
		balance: initialAmount,
		userId: req.user.sub,
	})

	return reply.status(201).send({ account })
}

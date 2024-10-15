import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateAccountUseCase } from '@useCases/accounts/factories/makeUpdateAccountUseCase'

export async function edit(req: FastifyRequest, reply: FastifyReply) {
	const updateAccountParamsSchema = z.object({
		id: z.string().uuid(),
	})

	const updateAccountBodySchema = z.object({
		type: z.enum(['CURRENT_ACCOUNT', 'MACHINE_ACCOUNT', 'INVESTMENT_ACCOUNT']),
		bank: z.string(),
	})

	const { id } = updateAccountParamsSchema.parse(req.params)

	const { type, bank } = updateAccountBodySchema.parse(req.body)

	const updateAccountByIdUseCase = makeUpdateAccountUseCase()

	const { account } = await updateAccountByIdUseCase.execute({
		id,
		type,
		bank,
	})

	return reply.status(200).send({ account })
}

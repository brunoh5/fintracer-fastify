import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateAccountUseCase } from '@useCases/accounts/factories/makeUpdateAccountUseCase'

export async function edit(req: FastifyRequest, reply: FastifyReply) {
	const updateAccountParamsSchema = z.object({
		id: z.string().uuid(),
	})

	const updateAccountBodySchema = z.object({
		type: z.string(),
		bank: z.string(),
		number: z.string().optional(),
	})

	const { id } = updateAccountParamsSchema.parse(req.params)

	const { type, bank, number } = updateAccountBodySchema.parse(req.body)

	const updateAccountByIdUseCase = makeUpdateAccountUseCase()

	const { account } = await updateAccountByIdUseCase.execute({
		accountId: id,
		type,
		bank,
		number: number ?? '',
	})

	return reply.status(200).send({ account })
}
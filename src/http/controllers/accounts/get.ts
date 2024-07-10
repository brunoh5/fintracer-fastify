import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetAccountUseCase } from '@useCases/accounts/factories/makeGetAccountUseCase'

export async function get(req: FastifyRequest, reply: FastifyReply) {
	const listAccountParamsSchema = z.object({
		id: z.string().uuid(),
	})

	const { id } = listAccountParamsSchema.parse(req.params)

	const listAccountUseCase = makeGetAccountUseCase()

	const { account } = await listAccountUseCase.execute({
		accountId: id,
	})

	return reply.status(200).send({ account })
}

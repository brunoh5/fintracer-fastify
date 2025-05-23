import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeDeleteAccountUseCase } from '@useCases/accounts/factories/makeDeleteAccountUseCase'

export async function deleteAccount(req: FastifyRequest, reply: FastifyReply) {
	const deleteAccountParamsSchema = z.object({
		id: z.string(),
	})

	const { id } = deleteAccountParamsSchema.parse(req.params)

	const deleteAccountUseCase = makeDeleteAccountUseCase()

	await deleteAccountUseCase.execute(id)

	return reply.status(204).send()
}

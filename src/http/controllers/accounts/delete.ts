import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeDeleteAccountUseCase } from '@useCases/accounts/factories/makeDeleteAccountUseCase'

export async function deleteAccount(req: FastifyRequest, reply: FastifyReply) {
	const deleteAccountParamsSchema = z.object({
		id: z.string().uuid(),
	})

	const { id } = deleteAccountParamsSchema.parse(req.params)

	const deleteAccountUseCase = makeDeleteAccountUseCase()

	await deleteAccountUseCase.execute({ accountId: id })

	return reply.status(204).send()
}

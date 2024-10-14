import { makeEditUserUseCase } from '@useCases/users/factories/makeEditUserUseCase'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function edit(req: FastifyRequest, reply: FastifyReply) {
	const editBodySchema = z.object({
		current_password: z.string(),
		new_password: z.string(),
	})

	const { current_password, new_password } = editBodySchema.parse(req.body)

	const editUser = makeEditUserUseCase()

	await editUser.execute({
		userId: req.user.sub,
		current_password,
		new_password,
	})

	return reply.status(204).send()
}

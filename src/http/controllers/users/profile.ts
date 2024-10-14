import { makeGetProfileUseCase } from '@useCases/users/factories/makeGetProfileUseCase'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(req: FastifyRequest, reply: FastifyReply) {
	await req.jwtVerify()

	const getProfile = makeGetProfileUseCase()

	const user = await getProfile.execute(req.user.sub)

	return reply.status(200).send({
		user: {
			...user,
			password_hash: undefined,
		},
	})
}

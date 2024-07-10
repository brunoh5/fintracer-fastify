import { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchAccountsUseCase } from '@useCases/accounts/factories/makeFetchAccountsUseCase'

export async function fetch(req: FastifyRequest, reply: FastifyReply) {
	const fetchAccountsUseCase = makeFetchAccountsUseCase()

	const resume = await fetchAccountsUseCase.execute({
		userId: req.user.sub,
	})

	return reply.status(200).send(resume)
}
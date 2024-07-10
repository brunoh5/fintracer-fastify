import { makeFetchCurrentExpenses } from '@useCases/transactions/factories/makeFetchCurrentExpensesUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(req: FastifyRequest, reply: FastifyReply) {
	const fetchCurrentExpenses = makeFetchCurrentExpenses()

	const metrics = await fetchCurrentExpenses.execute({
		userId: req.user.sub,
	})

	return reply.status(200).send({ metrics })
}

import { makeFetchCurrentExpenses } from '@useCases/transactions/factories/makeFetchCurrentExpensesUseCase'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(req: FastifyRequest, reply: FastifyReply) {
	const fetchCurrentExpenses = makeFetchCurrentExpenses()

	const summaryByCategories = await fetchCurrentExpenses.execute({
		userId: req.user.sub,
	})

	return reply.status(200).send({ summaryByCategories })
}

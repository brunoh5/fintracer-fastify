import { makeFetchMonthlyMetricsByYearUseCase } from '@useCases/transactions/factories/makeMonthlyExpenseUseCase'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function monthlyExpensesByYear(
	req: FastifyRequest,
	reply: FastifyReply,
) {
	const monthlyExpensesByYear = makeFetchMonthlyMetricsByYearUseCase()

	const expenses = await monthlyExpensesByYear.execute({
		userId: req.user.sub,
		year: new Date().getFullYear(),
	})

	return reply.status(200).send({ monthlyExpenses: expenses })
}

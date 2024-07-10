import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { FetchMonthlyMetricsByYearUseCase } from '../fetch-monthly-metrics'

export function makeFetchMonthlyMetricsByYearUseCase() {
	const transactionsRepository = new PrismaTransactionsRepository()
	const useCase = new FetchMonthlyMetricsByYearUseCase(transactionsRepository)

	return useCase
}

// import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'

import { DrizzleTransactionsRepository } from '@repositories/drizzle/drizzle-transactions-repository'
import { FetchMonthlyMetricsByYearUseCase } from '../fetch-monthly-metrics'

export function makeFetchMonthlyMetricsByYearUseCase() {
	// const transactionsRepository = new PrismaTransactionsRepository()
	const transactionsRepository = new DrizzleTransactionsRepository()
	const useCase = new FetchMonthlyMetricsByYearUseCase(transactionsRepository)

	return useCase
}

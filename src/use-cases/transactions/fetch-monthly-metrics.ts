import type { TransactionsRepository } from '@/repositories/transactions-repository'

interface FetchMonthlyMetricsByYearUseCaseProps {
	userId: string
	year: number
}

export class FetchMonthlyMetricsByYearUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({ userId }: FetchMonthlyMetricsByYearUseCaseProps) {
		const monthlyExpenses =
			await this.transactionsRepository.expensesTransactionsSummaryByMonthByYear(
				userId
			)

		return monthlyExpenses
	}
}

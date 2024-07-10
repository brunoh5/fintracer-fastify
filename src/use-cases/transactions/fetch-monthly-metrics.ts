import { TransactionsRepository } from '@/repositories/transactions-repository'

interface FetchMonthlyMetricsByYearUseCaseProps {
	userId: string
	year: number
}

export class FetchMonthlyMetricsByYearUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({ userId, year }: FetchMonthlyMetricsByYearUseCaseProps) {
		const monthlyExpenses =
			this.transactionsRepository.monthlyExpensesMetricsByYear(year, userId)

		return monthlyExpenses
	}
}

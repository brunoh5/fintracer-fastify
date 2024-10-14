import type { TransactionsRepository } from '@/repositories/transactions-repository'

interface FetchCurrentExpensesUseCaseRequest {
	userId: string
}

export class FetchCurrentExpenses {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({ userId }: FetchCurrentExpensesUseCaseRequest) {
		const categories =
			await this.transactionsRepository.summaryExpensesByCategory(userId)

		return categories
	}
}

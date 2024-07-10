import { TransactionsRepository } from '@/repositories/transactions-repository'

interface FetchCurrentExpensesUseCaseRequest {
	userId: string
}

interface ExpensesResponse {
	category: string
	amount: number
	diffBetweenMonth: number
}

export class FetchCurrentExpenses {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({ userId }: FetchCurrentExpensesUseCaseRequest) {
		const currentExpenses =
			await this.transactionsRepository.monthExpenses(userId)

		console.log(currentExpenses)

		const expenses: ExpensesResponse[] = currentExpenses.map((expense) => {
			const currentMonth = expense.transactions[0] || {
				month: null,
				total: 0,
			}

			const lastMonth = expense.transactions[1] || {
				month: null,
				total: 0,
			}

			const absoluteDiff = currentMonth.total - lastMonth.total
			const average = (currentMonth.total + lastMonth.total) / 2
			const monthlyDiffInPercentage = (100 * absoluteDiff) / average

			return {
				category: expense.category,
				amount: currentMonth.total,
				diffBetweenMonth: Math.floor(monthlyDiffInPercentage),
			}
		})

		return expenses
	}
}

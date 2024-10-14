import type {
	FindManyTransactionsProps,
	Transaction,
	TransactionsRepository,
} from '@repositories/transactions-repository'

interface FetchTransactionsUseCaseResponse {
	transactions: Transaction[]
	totalRevenueInCents: number
	totalExpenseInCents: number
	meta: {
		totalCount: number
		pageIndex: number
		perPage: number
	}
}

export class FetchTransactionsUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		userId,
		name,
		category,
		payment_method,
		pageIndex,
		accountId,
		from,
		to,
		type,
	}: FindManyTransactionsProps): Promise<FetchTransactionsUseCaseResponse> {
		const {
			transactions,
			transactionsCount,
			expensesInCents,
			revenuesInCents,
		} = await this.transactionsRepository.findManyTransactions({
			userId,
			name,
			pageIndex,
			accountId,
			category,
			payment_method,
			from,
			to,
			type,
		})

		return {
			transactions,
			totalExpenseInCents: expensesInCents,
			totalRevenueInCents: revenuesInCents,
			meta: {
				totalCount: transactionsCount,
				pageIndex,
				perPage: 10,
			},
		}
	}
}

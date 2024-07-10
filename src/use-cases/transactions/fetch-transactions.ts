import { Transaction } from '@prisma/client'
import {
	FindManyTransactionsProps,
	TransactionsRepository,
} from '@repositories/transactions-repository'

interface FetchTransactionsUseCaseResponse {
	transactions: Transaction[]
	transactionsStatus: {
		totalRevenueInCents: number
		totalExpenseInCents: number
	}
	meta: {
		totalCount: number
		pageIndex: number
		perPage: number
	}
}

type FindManyRequest = FindManyTransactionsProps & { pageIndex: number }

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
	}: FindManyRequest): Promise<FetchTransactionsUseCaseResponse> {
		const { transactions, transactionsCount, transactionsStatus } =
			await this.transactionsRepository.findManyTransactions({
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
			transactionsStatus,
			meta: {
				totalCount: transactionsCount,
				pageIndex,
				perPage: 10,
			},
		}
	}
}

import type { paymentMethod } from '../db/schema'

export interface FindManyTransactionsProps {
	userId: string
	pageIndex: number
	from?: string
	to?: string
	name?: string
	accountId?: string
	type?: 'revenue' | 'expense'
	method?: typeof paymentMethod
	categoryId?: string
	category?: string
	payment_method?: string
}

export type Transaction = {
	id: string
	name: string
	date: Date | null
	amount: number
	createdAt?: Date
	userId?: string
	accountId: string
	accountName?: string | null
	categoryId?: string | null
	categoryName?: string | null
	paymentMethod:
		| 'MONEY'
		| 'PIX'
		| 'CREDIT_CARD'
		| 'DEBIT_CARD'
		| 'BANK_TRANSFER'
}

export type CreateOrUpdateTransactionRequest = {
	id?: string
	name: string
	accountId?: string
	userId?: string
	amount: number
	categoryId?: string
	date: string | Date
	category:
		| 'OTHERS'
		| 'HOME'
		| 'SHOPPING'
		| 'FOOD'
		| 'ENTERTAINMENT'
		| 'TRANSPORTATION'
	payment_method:
		| 'MONEY'
		| 'PIX'
		| 'CREDIT_CARD'
		| 'DEBIT_CARD'
		| 'BANK_TRANSFER'
}

export type GetAllTransactionsByUserIdResponse = {
	transactions: Transaction[]
	transactionsCount: number
	revenuesInCents: number
	expensesInCents: number
}

export type SummaryExpensesByCategory = Record<
	string,
	{
		lastMonth: number
		currentMonth: number
	}
>

export type ExpensesTransactionsSummaryByMonthByYear = {
	month: string
	totalAmount: number
}

export interface TransactionsRepository {
	expensesTransactionsSummaryByMonthByYear(
		userId: string
	): Promise<ExpensesTransactionsSummaryByMonthByYear[]>
	summaryExpensesByCategory(userId: string): Promise<SummaryExpensesByCategory>
	delete(id: string): Promise<void>
	findManyTransactions(
		data: FindManyTransactionsProps
	): Promise<GetAllTransactionsByUserIdResponse>
	findById(id: string): Promise<Transaction | null>
	update(data: CreateOrUpdateTransactionRequest): Promise<Transaction>
	create(data: CreateOrUpdateTransactionRequest): Promise<Transaction>
}

import dayjs from 'dayjs'
import { and, asc, desc, eq, gte, ilike, lt, lte, sql, sum } from 'drizzle-orm'

import { db } from '@/db'
import { accounts, transactions } from '@/db/schema'
import type {
	CreateOrUpdateTransactionRequest,
	ExpensesTransactionsSummaryByMonthByYear,
	FindManyTransactionsProps,
	GetAllTransactionsByUserIdResponse,
	SummaryExpensesByCategory,
	Transaction,
	TransactionsRepository,
} from '@repositories/transactions-repository'
import { ResourceNotFoundError } from '@useCases/errors/resource-not-found-error'

export class DrizzleTransactionsRepository implements TransactionsRepository {
	async expensesTransactionsSummaryByMonthByYear(
		userId: string
	): Promise<ExpensesTransactionsSummaryByMonthByYear[]> {
		const currentDate = dayjs().toDate()
		const startOfMonthInLastYear = dayjs()
			.subtract(1, 'year')
			.startOf('month')
			.toDate()

		const result = await db
			.select({
				month: sql /*sql*/`
					TO_CHAR(${transactions.date}, 'YYYY-MM')
				`
					.mapWith(String)
					.as('month'),
				totalAmount: sql /*sql*/`
					SUM(${transactions.amount}) * -1
				`
					.mapWith(Number)
					.as('total_amount'),
			})
			.from(transactions)
			.where(
				and(
					lt(transactions.amount, 0),
					eq(transactions.userId, userId),
					gte(transactions.date, startOfMonthInLastYear),
					lte(transactions.date, currentDate)
				)
			)
			.groupBy(sql /*sql*/`
				TO_CHAR(${transactions.date}, 'YYYY-MM')
			`)

		return result
	}

	async summaryExpensesByCategory(
		userId: string
	): Promise<SummaryExpensesByCategory> {
		const startOfLastMonth = dayjs()
			.subtract(1, 'month')
			.startOf('month')
			.toDate()
		const endOfCurrentMonth = dayjs().endOf('month').toDate()

		const transactionsInTwoMonths = db.$with('transactions_in_two_months').as(
			db
				.select({
					category: transactions.category,
					month: sql /*sql*/`TO_CHAR(${transactions.date}, 'YYYY-MM')`.as(
						'month'
					),
					totalAmount: sql /*sql*/`SUM(amount)`.as('total_amount'),
				})
				.from(transactions)
				.where(
					and(
						lt(transactions.amount, 0),
						eq(transactions.userId, userId),
						gte(transactions.date, startOfLastMonth),
						lte(transactions.date, endOfCurrentMonth)
					)
				)
				.groupBy(
					transactions.category,
					sql /*sql*/`TO_CHAR(${transactions.date}, 'YYYY-MM')`
				)
		)

		const transactionsByCategory = db.$with('transactions_by_category').as(
			db
				.select({
					category: transactionsInTwoMonths.category,
					lastMonth: sql /*sql*/`
						SUM(
							CASE
								WHEN MONTH = '2024-08' THEN ${transactionsInTwoMonths.totalAmount}
								ELSE 0
							END
						)
					`
						.mapWith(Number)
						.as('last_month'),
					currentMonth: sql /*sql*/`
						SUM(
							CASE
								WHEN MONTH = '2024-10' THEN ${transactionsInTwoMonths.totalAmount}
								ELSE 0
							END
						)
					`
						.mapWith(Number)
						.as('current_month'),
				})
				.from(transactionsInTwoMonths)
				.groupBy(transactionsInTwoMonths.category)
		)

		const [result] = await db
			.with(transactionsInTwoMonths, transactionsByCategory)
			.select({
				categories: sql /*sql*/<SummaryExpensesByCategory>`
					JSON_OBJECT_AGG(
						category,
						JSON_BUILD_OBJECT(
							'lastMonth',
							${transactionsByCategory.lastMonth},
							'currentMonth',
							${transactionsByCategory.currentMonth}
						)
					)
				`,
			})
			.from(transactionsByCategory)

		return result.categories
	}

	async delete(id: string): Promise<void> {
		await db.delete(transactions).where(eq(transactions.id, id))
	}

	async findManyTransactions({
		pageIndex,
		accountId,
		from,
		to,
		method,
		name,
		type,
		userId,
	}: FindManyTransactionsProps): Promise<GetAllTransactionsByUserIdResponse> {
		const startOfDay = dayjs(from).startOf('day').toDate()
		const endOfDay = dayjs(to).endOf('day').toDate()

		const allTransactions = db.$with('all_transactions').as(
			db
				.select({
					id: transactions.id,
					name: transactions.name,
					date: transactions.date,
					amount: transactions.amount,
					category: transactions.category,
					paymentMethod: transactions.paymentMethod,
					accountId: transactions.accountId,
					accountName: accounts.bank,
				})
				.from(transactions)
				.leftJoin(accounts, eq(transactions.accountId, accounts.id))
				.where(
					and(
						eq(transactions.userId, userId),
						method
							? sql /*sql*/`cast(${transactions.paymentMethod} AS TEXT) = ${method}`
							: undefined,
						name ? ilike(transactions.name, `%${name}%`) : undefined,
						accountId ? eq(transactions.accountId, accountId) : undefined,
						from ? gte(transactions.date, startOfDay) : undefined,
						to ? lte(transactions.date, endOfDay) : undefined
					)
				)
				.groupBy(transactions.id, accounts.bank)
				.orderBy(desc(transactions.date), asc(transactions.createdAt))
				.limit(10)
				.offset(pageIndex * 10)
		)

		const revenueTransactions = db.$with('revenues_transactions').as(
			db
				.select({
					amount: allTransactions.amount,
				})
				.from(allTransactions)
				.where(gte(allTransactions.amount, 0))
		)

		const expenseTransactions = db.$with('expense_transactions').as(
			db
				.select({
					amount: allTransactions.amount,
				})
				.from(allTransactions)
				.where(lte(allTransactions.amount, 0))
		)

		const [result] = await db
			.with(allTransactions, revenueTransactions, expenseTransactions)
			.select({
				transactions: sql /*sql*/<Transaction[]>`
					JSON_AGG(${allTransactions})
				`.as('transactions'),
				transactionsCount: sql /*sql*/`
					(SELECT COUNT(${transactions.id}) FROM ${transactions})
				`
					.mapWith(Number)
					.as('total'),
				revenuesInCents: sql /*sql*/`
					(SELECT SUM(${revenueTransactions.amount})
					FROM ${revenueTransactions})
				`.mapWith(Number),
				expensesInCents: sql /*sql*/`
					(SELECT SUM(${expenseTransactions.amount})
					FROM ${expenseTransactions})
				`.mapWith(Number),
			})
			.from(allTransactions)

		return result
	}

	async findById(id: string): Promise<Transaction | null> {
		const [transaction] = await db
			.select({
				id: transactions.id,
				date: transactions.date,
				name: transactions.name,
				amountInCents: transactions.amount,
				// categoryName: transactionCategories.title,
				bankAccountName: accounts.bank,
				method: transactions.paymentMethod,
				amount: transactions.amount,
				accountId: transactions.accountId,
			})
			.from(transactions)
			// .leftJoin(
			// 	transactionCategories,
			// 	eq(transactions.categoryId, transactionCategories.id)
			// )
			.leftJoin(accounts, eq(transactions.accountId, accounts.id))
			.where(eq(transactions.id, id))

		return transaction
	}

	update(data: CreateOrUpdateTransactionRequest): Promise<Transaction> {
		throw new Error('Method not implemented.')
	}

	async create({
		name,
		date,
		amount,
		accountId,
		userId,
	}: CreateOrUpdateTransactionRequest): Promise<Transaction> {
		if (!userId) {
			throw new ResourceNotFoundError()
		}

		if (!accountId) {
			throw new ResourceNotFoundError()
		}

		const result = await db
			.insert(transactions)
			.values({
				name,
				accountId,
				userId,
				amount,
				date: new Date(date),
			})
			.returning({
				id: transactions.id,
				name: transactions.name,
				accountId: transactions.accountId,
				userId: transactions.userId,
				amount: transactions.amount,
				method: transactions.paymentMethod,
				date: transactions.date,
			})

		return result[0]
	}
}
import { Prisma } from '@prisma/client'
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns'
import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

import {
	FindManyTransactionsProps,
	MonthExpensesResponse,
	MonthlyExpense,
	TransactionsRepository,
} from '../transactions-repository'

export class PrismaTransactionsRepository implements TransactionsRepository {
	async create(data: Prisma.TransactionUncheckedCreateInput) {
		return prisma.transaction.create({ data })
	}

	async findManyTransactions({
		userId,
		accountId,
		name,
		type,
		payment_method,
		category,
		pageIndex,
		from,
		to,
	}: FindManyTransactionsProps) {
		const startDate = from
			? startOfDay(new Date(from))
			: startOfMonth(new Date())
		const endDate = to
			? endOfDay(new Date(to))
			: from
				? endOfMonth(new Date(from))
				: new Date()

		const transactionsResult = await prisma.transaction.findMany({
			where: {
				name: {
					contains: name,
					mode: 'insensitive',
				},
				amount: {
					gte: type === 'revenue' ? 0 : undefined,
					lt: type === 'expense' ? 0 : undefined,
				},
				userId,
				accountId,
				payment_method,
				category,
				date: {
					gte: startDate.toISOString(),
					lte: endDate.toISOString(),
				},
			},
			take: 10,
			skip: pageIndex * 10,
			orderBy: {
				date: 'desc',
			},
		})

		const transactionsCount = await prisma.transaction.count({
			where: {
				name: {
					contains: name,
					mode: 'insensitive',
				},
				userId,
				accountId,
				amount: {
					gte: type === 'revenue' ? 0 : undefined,
					lt: type === 'expense' ? 0 : undefined,
				},
				payment_method,
				category,
				date: {
					gte: startDate.toISOString(),
					lte: endDate.toISOString(),
				},
			},
		})

		const { _sum: revenueSum } = await prisma.transaction.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				name: {
					contains: name,
					mode: 'insensitive',
				},
				userId,
				accountId,
				amount: {
					gte: 0,
				},
				payment_method,
				category,
				date: {
					gte: startDate.toISOString(),
					lte: endDate.toISOString(),
				},
			},
		})

		const { _sum: expenseSum } = await prisma.transaction.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				name: {
					contains: name,
					mode: 'insensitive',
				},
				userId,
				accountId,
				amount: {
					lt: 0,
				},
				payment_method,
				category,
				date: {
					gte: startDate.toISOString(),
					lte: endDate.toISOString(),
				},
			},
		})

		const transactionsStatus = {
			totalRevenueInCents: revenueSum.amount ?? 0,
			totalExpenseInCents: expenseSum.amount ?? 0,
		}

		const transactions = transactionsResult.map((transaction) => {
			return Object.assign(transaction, {
				amount: undefined,
				amountInCents: transaction.amount,
				userId: undefined,
			})
		})

		return { transactions, transactionsCount, transactionsStatus }
	}

	async update(id: string, data: Prisma.TransactionUpdateInput) {
		return prisma.transaction.update({
			where: {
				id,
			},
			data,
		})
	}

	async delete(id: string) {
		return await prisma.transaction.delete({
			where: {
				id,
			},
		})
	}

	async findById(id: string) {
		const transaction = await prisma.transaction.findUnique({
			where: {
				id,
			},
		})

		if (!transaction) {
			return null
		}

		return Object.assign(transaction, {
			amount: transaction.amount / 100,
			amountInCents: transaction.amount,
			userId: undefined,
		})
	}

	async monthlyExpensesMetricsByYear(year: number, userId: string) {
		const today = dayjs()
		const lastYear = today.subtract(1, 'year')

		const lastYearWithMonth = lastYear.format('YYYY-MM')
		const currentYearWithMonth = today.format('YYYY-MM')

		// Convert the formatted date to the first and last date of the month range
		const startDate = dayjs(lastYearWithMonth + '-01')
			.startOf('month')
			.toDate()
		const endDate = dayjs(currentYearWithMonth + '-01')
			.endOf('month')
			.toDate()

		// const transactions = await prisma.transaction.groupBy({
		// 	by: ['date'],
		// 	where: {
		// 		date: {
		// 			gte: startDate,
		// 			lte: endDate,
		// 		},
		// 		amount: {
		// 			lt: 0,
		// 		},
		// 		userId,
		// 	},
		// 	_sum: {
		// 		amount: true,
		// 	},
		// 	orderBy: {
		// 		date: 'asc',
		// 	},
		// })

		const transactions = await prisma.transaction.findMany({
			where: {
				date: {
					gte: startDate,
					lte: endDate,
				},
				amount: {
					lt: 0,
				},
				userId,
			},
			orderBy: {
				date: 'asc',
			},
		})

		const monthlyExpenses = transactions.reduce((acc, transaction) => {
			const month = dayjs(transaction.date).format('MMM/YYYY')
			const amount = transaction.amount / 100

			/** @ts-expect-error need to be better */
			if (!acc[month]) {
				/** @ts-expect-error need to be better */
				acc[month] = 0
			}
			/** @ts-expect-error need to be better */
			acc[month] += amount
			return acc
		}, {})

		// Convert the grouped object into an array of { month, total }
		const formattedExpenses = Object.keys(monthlyExpenses).map((month) => ({
			month,
			/** @ts-expect-error need to be better */
			total: Number(monthlyExpenses[month] * -1),
		}))

		console.log({ monthlyExpenses, formattedExpenses })

		return formattedExpenses
	}

	async monthExpenses(userId: string) {
		const today = dayjs()
		const lastMonth = today.subtract(1, 'month')

		const lastMonthWithYear = lastMonth.format('YYYY-MM')
		const currentMonthWithYear = today.format('YYYY-MM')

		// Convert the formatted date to the first and last date of the month range
		const startDate = dayjs(lastMonthWithYear + '-01')
			.startOf('month')
			.toDate()
		const endDate = dayjs(currentMonthWithYear + '-01')
			.endOf('month')
			.toDate()

		// Fetch transactions from Prisma
		const transactions = await prisma.transaction.findMany({
			where: {
				date: {
					gte: startDate,
					lte: endDate,
				},
				userId,
				amount: {
					lt: 0,
				},
			},
			select: {
				date: true,
				amount: true,
				category: true,
			},
			orderBy: {
				date: 'desc',
			},
		})

		// Process transactions to group by category and month
		const groupedExpenses: Record<string, { month: number; total: bigint }[]> =
			{}

		transactions.forEach((transaction) => {
			const month = dayjs(transaction.date).month() + 1 // month is 0-indexed in dayjs
			const category = transaction.category
			const amount = BigInt(transaction.amount)

			if (!groupedExpenses[category]) {
				groupedExpenses[category] = []
			}

			const monthEntry = groupedExpenses[category].find(
				(entry) => entry.month === month,
			)

			if (monthEntry) {
				monthEntry.total += amount
			} else {
				groupedExpenses[category].push({ month, total: amount })
			}
		})

		// Convert grouped expenses into the required format
		/** @ts-expect-error falta tipagem */
		const expenses: MonthExpensesResponse[] = Object.entries(
			groupedExpenses,
		).map(([category, transactions]) => ({
			category,
			transactions,
		}))

		return expenses.sort((a, b) => a.category.localeCompare(b.category))
	}
}

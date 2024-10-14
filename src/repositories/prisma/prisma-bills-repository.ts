import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type { BillsRepository, FindManyBillsProps } from '../bills-repository'

export class PrismaBillsRepository implements BillsRepository {
	async create({
		title,
		description,
		amount,
		dueDate,
		paid_at,
		payment_method,
		userId,
	}: Prisma.BillUncheckedCreateInput) {
		const bill = await prisma.bill.create({
			data: {
				title,
				description,
				amount,
				dueDate,
				paid_at,
				payment_method,
				userId,
			},
		})

		return Object.assign(bill, {
			amountInCents: bill.amount,
			amount: undefined,
			userId: undefined,
		})
	}

	async findManyBills({
		userId,
		title,
		pageIndex,
		status,
	}: FindManyBillsProps) {
		const billsResult = await prisma.bill.findMany({
			where: {
				title: {
					contains: title,
					mode: 'insensitive',
				},
				userId,
				paid_at: {
					not: status === 'paid' ? null : undefined,
					equals: status === 'not_paid' ? null : undefined,
				},
			},
			take: 10,
			skip: pageIndex * 10,
			orderBy: {
				created_at: 'desc',
			},
		})

		const billsCount = await prisma.bill.count({
			where: {
				title: {
					contains: title,
					mode: 'insensitive',
				},
				userId,
				paid_at: {
					not: status === 'paid' ? null : undefined,
					equals: status === 'not_paid' ? null : undefined,
				},
			},
		})

		const { _sum } = await prisma.bill.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				title: {
					contains: title,
					mode: 'insensitive',
				},
				userId,
				paid_at: {
					not: status === 'paid' ? null : undefined,
					equals: status === 'not_paid' ? null : undefined,
				},
			},
		})

		const { _sum: notPaidInCentsSum } = await prisma.bill.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				title: {
					contains: title,
					mode: 'insensitive',
				},
				userId,
				paid_at: {
					equals: null,
				},
			},
		})

		const bills = billsResult.map(bill => {
			return Object.assign(bill, {
				amount: undefined,
				amountInCents: bill.amount,
				userId: undefined,
			})
		})

		const billsStatus = {
			paidInCents: 0,
			notPaidInCents: notPaidInCentsSum.amount ?? 0,
		}

		return {
			bills,
			billsCount,
			totalInCents: _sum.amount ?? 0,
			billsStatus,
		}
	}

	async findById(id: string) {
		const bill = await prisma.bill.findFirst({ where: { id } })

		return bill
	}

	async update(id: string, data: Prisma.BillUncheckedUpdateInput) {
		const bill = await prisma.bill.update({
			where: {
				id,
			},

			data,
		})

		return bill
	}
}

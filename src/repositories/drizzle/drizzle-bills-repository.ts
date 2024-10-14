import { db } from '@/db'
import { bills } from '@/db/schema'
import type {
	Bill,
	BillsRepository,
	CreateOrUpdateBillRequest,
	FindManyBillsProps,
	FindManyBillsResponse,
} from '@repositories/bills-repository'
import { ResourceNotFoundError } from '@useCases/errors/resource-not-found-error'
import { and, desc, eq, ilike, isNotNull, isNull, sql } from 'drizzle-orm'

export class DrizzleBillsRepository implements BillsRepository {
	async findManyBills({
		userId,
		title,
		pageIndex,
		status,
	}: FindManyBillsProps): Promise<FindManyBillsResponse> {
		const allBills = db.$with('all_bills').as(
			db
				.select({
					id: bills.id,
					title: bills.title,
					amount: bills.amount,
					created_at: bills.createdAt,
					dueDate: bills.dueDate,
					payment_method: bills.paymentMethod,
					paidAt: bills.paidAt,
				})
				.from(bills)
				.where(
					and(
						eq(bills.userId, userId),
						title ? ilike(bills.title, `%${title}%`) : undefined,
						// payment_method
						// 	? sql /*sql*/`cast(${bills.paymentMethod} AS TEXT) = ${payment_method}`
						// 	: undefined,
						status === 'paid_at' ? isNotNull(bills.paidAt) : undefined,
						status === 'not_paid' ? isNull(bills.paidAt) : undefined
					)
				)
				.orderBy(desc(bills.dueDate))
				.limit(10)
				.offset(pageIndex * 10)
		)

		const totalPaidInCents = db.$with('total_paid_in_cents').as(
			db
				.select({
					paidAmount: allBills.amount,
				})
				.from(allBills)
				.where(isNotNull(allBills.paidAt))
		)

		const totalNotPaidInCents = db.$with('total_not_paid_in_cents').as(
			db
				.select({
					notPaidAmount: allBills.amount,
				})
				.from(allBills)
				.where(isNull(allBills.paidAt))
		)

		const [result] = await db
			.with(allBills, totalPaidInCents, totalNotPaidInCents)
			.select({
				bills: sql /*sql*/<Bill[]>`
				JSON_AGG(${allBills})
			`.as('bills'),
				billsCount: sql /*sql*/`
					(SELECT COUNT(${bills.id}) FROM ${bills})
				`
					.mapWith(Number)
					.as('bills_count'),
				paidInCents: sql /*sql*/`
					(SELECT SUM(${totalPaidInCents.paidAmount})
					FROM ${totalPaidInCents})
				`
					.mapWith(Number)
					.as('paid_in_cents'),
				notPaidInCents: sql /*sql*/`
					(SELECT SUM(${totalNotPaidInCents.notPaidAmount})
					FROM ${totalNotPaidInCents})
				`
					.mapWith(Number)
					.as('not_paid_in_cents'),
			})
			.from(allBills)

		return result
	}

	async findById(id: string): Promise<Bill | null> {
		const [bill] = await db
			.select({
				id: bills.id,
				dueDate: bills.dueDate,
				title: bills.title,
				amount: bills.amount,
				created_at: bills.createdAt,
				payment_method: bills.paymentMethod,
			})
			.from(bills)
			.where(eq(bills.id, id))

		return bill
	}

	async update({
		id,
		amount,
		title,
		description,
	}: CreateOrUpdateBillRequest): Promise<Bill> {
		if (!id) {
			throw new ResourceNotFoundError()
		}

		const [bill] = await db
			.update(bills)
			.set({
				amount,
				title,
				description,
			})
			.where(eq(bills.id, id))
			.returning({
				id: bills.id,
				title: bills.title,
				amount: bills.amount,
				created_at: bills.createdAt,
				dueDate: bills.dueDate,
				payment_method: bills.paymentMethod,
			})

		return bill
	}

	async create({
		title,
		amount,
		userId,
		description,
	}: CreateOrUpdateBillRequest): Promise<Bill> {
		if (!userId) {
			throw new ResourceNotFoundError()
		}

		const [bill] = await db
			.insert(bills)
			.values({ title, amount, description, userId })
			.returning({
				id: bills.id,
				title: bills.title,
				amount: bills.amount,
				dueDate: bills.dueDate,
				created_at: bills.createdAt,
				payment_method: bills.paymentMethod,
			})

		return bill
	}
}

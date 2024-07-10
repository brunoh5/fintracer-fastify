import { Bill } from '@prisma/client'

import { BillsRepository } from '@/repositories/bills-repository'

interface FetchBillsUseCaseProps {
	userId: string
	title?: string
	status?: string
	pageIndex: number
}

interface FetchBillsUseCaseResponse {
	bills: Bill[]
	totalInCents: number
	billsStatus: {
		paidInCents: number
		notPaidInCents: number
	}
	meta: {
		totalCount: number
		pageIndex: number
		perPage: number
	}
}

export class FetchBillsUseCase {
	constructor(private billsRepository: BillsRepository) {}

	async execute({
		userId,
		title,
		pageIndex,
		status,
	}: FetchBillsUseCaseProps): Promise<FetchBillsUseCaseResponse> {
		const { bills, billsCount, totalInCents, billsStatus } =
			await this.billsRepository.findManyBills({
				userId,
				title,
				pageIndex,
				status,
			})

		return {
			bills,
			totalInCents,
			billsStatus,
			meta: {
				totalCount: billsCount,
				pageIndex,
				perPage: 10,
			},
		}
	}
}

import type {
	BillsRepository,
	FindManyBillsProps,
	FindManyBillsResponse,
} from '@/repositories/bills-repository'

export class FetchBillsUseCase {
	constructor(private billsRepository: BillsRepository) {}

	async execute({
		userId,
		title,
		pageIndex,
		status,
	}: FindManyBillsProps): Promise<FindManyBillsResponse> {
		const { bills, billsCount, notPaidInCents, paidInCents } =
			await this.billsRepository.findManyBills({
				userId,
				title,
				pageIndex,
				status,
			})

		return {
			bills,
			notPaidInCents,
			paidInCents,
			billsCount,
		}
	}
}

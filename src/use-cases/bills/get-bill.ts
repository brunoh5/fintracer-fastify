import { BillsRepository } from '@/repositories/bills-repository'

interface GetBillUseCaseRequest {
	billId: string
}

export class GetBillUseCase {
	constructor(private billsRepository: BillsRepository) {}

	async execute({ billId }: GetBillUseCaseRequest) {
		const bill = await this.billsRepository.findById(billId)

		return bill
	}
}

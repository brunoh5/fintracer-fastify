import type {
	Bill,
	BillsRepository,
	CreateOrUpdateBillRequest,
} from '@/repositories/bills-repository'
import { ResourceNotFoundError } from '@useCases/errors/resource-not-found-error'

export class CreateBillUseCase {
	constructor(private billsRepository: BillsRepository) {}

	async execute(data: CreateOrUpdateBillRequest): Promise<{ bill: Bill }> {
		if (!data.userId) {
			throw new ResourceNotFoundError()
		}

		const bill = await this.billsRepository.create({
			...data,
		})

		return {
			bill,
		}
	}
}

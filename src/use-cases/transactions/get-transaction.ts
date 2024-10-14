import type {
	Transaction,
	TransactionsRepository,
} from '@/repositories/transactions-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetTransactionUseCaseRequest {
	transactionId: string
}

export class GetTransactionUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		transactionId,
	}: GetTransactionUseCaseRequest): Promise<{ transaction: Transaction }> {
		const transaction =
			await this.transactionsRepository.findById(transactionId)

		if (!transaction) {
			throw new ResourceNotFoundError()
		}

		return { transaction }
	}
}

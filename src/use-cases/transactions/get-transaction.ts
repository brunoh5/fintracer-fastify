import { Transaction } from '@prisma/client'

import { TransactionsRepository } from '@/repositories/transactions-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetTransactionUseCaseRequest {
	transactionId: string
}

interface GetTransactionUseCaseResponse {
	transaction: Transaction
}

export class GetTransactionUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		transactionId,
	}: GetTransactionUseCaseRequest): Promise<GetTransactionUseCaseResponse> {
		const transaction =
			await this.transactionsRepository.findById(transactionId)

		if (!transaction) {
			throw new ResourceNotFoundError()
		}

		return { transaction }
	}
}

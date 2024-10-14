import type { AccountsRepository } from '@repositories/accounts-repository'
import { ResourceNotFoundError } from '@useCases/errors/resource-not-found-error'

import type {
	CreateOrUpdateTransactionRequest,
	Transaction,
	TransactionsRepository,
} from '@/repositories/transactions-repository'

export class UpdateTransactionUseCase {
	constructor(
		private transactionsRepository: TransactionsRepository,
		private accountsRepository: AccountsRepository
	) {}

	async execute({
		id,
		category,
		name,
		amount,
		payment_method,
		date,
	}: CreateOrUpdateTransactionRequest): Promise<{ transaction: Transaction }> {
		if (!id) {
			throw new ResourceNotFoundError()
		}

		const transaction = await this.transactionsRepository.findById(id)

		if (!transaction) {
			throw new ResourceNotFoundError()
		}

		if (transaction.amount * 100 !== amount) {
			await this.accountsRepository.updateBalanceAccount(
				transaction?.accountId,
				transaction.amount * 100 * -1
			)

			await this.accountsRepository.updateBalanceAccount(
				transaction?.accountId,
				amount
			)
		}

		const newTransaction = await this.transactionsRepository.update({
			id,
			name,
			amount,
			payment_method,
			category,
			date,
		})

		return {
			transaction: newTransaction,
		}
	}
}

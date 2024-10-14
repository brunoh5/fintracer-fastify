import type { AccountsRepository } from '@/repositories/accounts-repository'
import type {
	CreateOrUpdateTransactionRequest,
	TransactionsRepository,
} from '@/repositories/transactions-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class CreateTransactionUseCase {
	constructor(
		private transactionsRepository: TransactionsRepository,
		private accountsRepository: AccountsRepository
	) {}

	async execute({
		accountId,
		category,
		userId,
		name,
		amount,
		payment_method,
		date,
	}: CreateOrUpdateTransactionRequest) {
		if (!accountId) {
			throw new ResourceNotFoundError()
		}
		const account = await this.accountsRepository.findById(accountId)

		if (!account) {
			throw new ResourceNotFoundError()
		}

		const transaction = await this.transactionsRepository.create({
			accountId,
			category,
			name,
			amount,
			payment_method,
			userId,
			date,
		})

		await this.accountsRepository.updateBalanceAccount(accountId, amount)

		return {
			transaction,
		}
	}
}

import { $Enums, Transaction } from '@prisma/client'
import { AccountsRepository } from '@repositories/accounts-repository'
import { ResourceNotFoundError } from '@useCases/errors/resource-not-found-error'

import { TransactionsRepository } from '@/repositories/transactions-repository'

interface UpdateTransactionUseCaseRequest {
	id: string
	name: string
	shopName?: string | null | undefined
	category: $Enums.Category
	payment_method: $Enums.PaymentMethod
	amount: number
	date?: Date | undefined
}

interface UpdateTransactionUseCaseResponse {
	transaction: Transaction
}

export class UpdateTransactionUseCase {
	constructor(
		private transactionsRepository: TransactionsRepository,
		private accountsRepository: AccountsRepository,
	) {}

	async execute({
		id,
		category,
		name,
		shopName,
		amount,
		payment_method,
		date,
	}: UpdateTransactionUseCaseRequest): Promise<UpdateTransactionUseCaseResponse> {
		const transaction = await this.transactionsRepository.findById(id)

		if (!transaction) {
			throw new ResourceNotFoundError()
		}

		console.log({ oldAmount: transaction.amount, amount })

		if (transaction.amount * 100 !== amount) {
			await this.accountsRepository.updateBalanceAccount(
				transaction?.accountId,
				transaction.amount * 100 * -1,
			)

			await this.accountsRepository.updateBalanceAccount(
				transaction?.accountId,
				amount,
			)
		}

		const newTransaction = await this.transactionsRepository.update(id, {
			name,
			shopName,
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

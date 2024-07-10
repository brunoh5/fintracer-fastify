import { AccountsRepository } from '@/repositories/accounts-repository'
import { BillsRepository } from '@/repositories/bills-repository'
import { TransactionsRepository } from '@/repositories/transactions-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface PayBillUseCaseRequest {
	billId: string
	accountId: string
	userId: string
	paid_at: Date | string
	paid_amount?: number
}

export class PayBillUseCase {
	constructor(
		private billsRepository: BillsRepository,
		private accountsRepository: AccountsRepository,
		private transactionsRepository: TransactionsRepository,
	) {}

	async execute({
		billId,
		accountId,
		userId,
		paid_at,
		paid_amount,
	}: PayBillUseCaseRequest) {
		const bill = await this.billsRepository.findById(billId)

		if (!bill) {
			throw new ResourceNotFoundError()
		}

		Object.assign(bill, {
			paid_amount,
			paid_at,
			accountId,
		})

		await this.accountsRepository.updateBalanceAccount(
			accountId,
			paid_amount ?? bill.amount,
		)

		await this.transactionsRepository.create({
			name: `Conta Paga: ${bill.title}`,
			accountId,
			userId,
			amount: paid_amount ?? bill.amount,
		})

		await this.billsRepository.update(billId, bill)
	}
}

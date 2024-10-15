import type { AccountsRepository } from '@/repositories/accounts-repository'
import type { BillsRepository } from '@/repositories/bills-repository'
import type { TransactionsRepository } from '@/repositories/transactions-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface PayBillUseCaseRequest {
	billId: string
	accountId: string
	userId: string
	paid_at: Date | string
	paid_amount?: number
	payment_method:
		| 'MONEY'
		| 'PIX'
		| 'CREDIT_CARD'
		| 'DEBIT_CARD'
		| 'BANK_TRANSFER'
}

export class PayBillUseCase {
	constructor(
		private billsRepository: BillsRepository,
		private accountsRepository: AccountsRepository,
		private transactionsRepository: TransactionsRepository
	) {}

	async execute({
		billId,
		accountId,
		userId,
		paid_at,
		paid_amount,
		payment_method,
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
			paid_amount ?? bill.amount
		)

		await this.transactionsRepository.create({
			name: `Conta Paga: ${bill.title}`,
			accountId,
			userId,
			amount: paid_amount ?? bill.amount,
			category: 'OTHERS',
			payment_method,
			date: new Date(paid_at),
		})

		await this.billsRepository.update(bill)
	}
}

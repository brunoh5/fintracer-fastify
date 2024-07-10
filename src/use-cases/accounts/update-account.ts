import { Account } from '@prisma/client'

import { AccountsRepository } from '@/repositories/accounts-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateAccountUseCaseRequest {
	accountId: string
	type: 'CURRENT_ACCOUNT' | 'MACHINE_ACCOUNT'
	bank: string | undefined
	number: string | null
}

interface UpdateAccountUseCaseResponse {
	account: Account
}

export class UpdateAccountUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute({
		accountId,
		type,
		bank,
		number,
	}: UpdateAccountUseCaseRequest): Promise<UpdateAccountUseCaseResponse> {
		const account = await this.accountsRepository.update(accountId, {
			type,
			bank,
			number,
		})

		if (!account) {
			throw new ResourceNotFoundError()
		}

		return {
			account,
		}
	}
}

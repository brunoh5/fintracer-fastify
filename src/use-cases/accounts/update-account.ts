import type {
	Account,
	AccountsRepository,
	CreateOrUpdateAccountRequest,
} from '@/repositories/accounts-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateAccountUseCaseResponse {
	account: Account
}

export class UpdateAccountUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute({
		id,
		type,
		bank,
	}: CreateOrUpdateAccountRequest): Promise<UpdateAccountUseCaseResponse> {
		const account = await this.accountsRepository.update({
			id,
			type,
			bank,
		})

		if (!account) {
			throw new ResourceNotFoundError()
		}

		return {
			account,
		}
	}
}

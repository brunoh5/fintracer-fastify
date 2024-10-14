import type {
	Account,
	AccountsRepository,
} from '@/repositories/accounts-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetAccountUseCaseRequest {
	accountId: string
}

interface GetAccountUseCaseResponse {
	account: Account
}

export class GetAccountUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute({
		accountId,
	}: GetAccountUseCaseRequest): Promise<GetAccountUseCaseResponse> {
		const account = await this.accountsRepository.findById(accountId)

		if (!account) {
			throw new ResourceNotFoundError()
		}

		return {
			account: Object.assign(account, {
				balanceInCents: account.balance,
				balance: undefined,
			}),
		}
	}
}

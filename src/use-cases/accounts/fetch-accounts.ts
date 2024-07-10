import { Account } from '@prisma/client'

import { AccountsRepository } from '@/repositories/accounts-repository'

interface FetchAccountsUseCaseRequest {
	userId: string
	pageIndex: number
}

interface FetchAccountsUseCaseResponse {
	accounts: Account[]
	totalBalanceInCents: number
	meta: {
		totalCount: number
		pageIndex: number
		perPage: number
	}
}

export class FetchAccountsUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute({
		userId,
		pageIndex,
	}: FetchAccountsUseCaseRequest): Promise<FetchAccountsUseCaseResponse> {
		const result = await this.accountsRepository.findManyByUserId(userId)

		return {
			accounts: result.accounts || [],
			totalBalanceInCents: result.total,
			meta: {
				totalCount: result.accountsCount,
				pageIndex,
				perPage: 10,
			},
		}
	}
}

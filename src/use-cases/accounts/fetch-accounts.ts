import type {
	Account,
	AccountsRepository,
} from '@/repositories/accounts-repository'

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
		const result = await this.accountsRepository.accountsSummary(userId)

		return {
			accounts: result.accounts,
			totalBalanceInCents: result.totalBalanceInCents,
			meta: {
				totalCount: result.totalAccounts,
				pageIndex,
				perPage: 10,
			},
		}
	}
}

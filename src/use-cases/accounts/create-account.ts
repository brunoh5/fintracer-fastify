import type {
	Account,
	AccountsRepository,
	CreateOrUpdateAccountRequest,
} from '@/repositories/accounts-repository'

export class CreateAccountUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute(
		data: CreateOrUpdateAccountRequest
	): Promise<{ account: Account }> {
		const account = await this.accountsRepository.create({
			...data,
		})

		return {
			account,
		}
	}
}

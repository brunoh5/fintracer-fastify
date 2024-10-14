import type { AccountsRepository } from '@repositories/accounts-repository'
import { ResourceNotFoundError } from '@useCases/errors/resource-not-found-error'

export class DeleteAccountUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute(id: string): Promise<void> {
		const account = await this.accountsRepository.findById(id)

		if (!account) {
			throw new ResourceNotFoundError()
		}

		await this.accountsRepository.delete(id)
	}
}

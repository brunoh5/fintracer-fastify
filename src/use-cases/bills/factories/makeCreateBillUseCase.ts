import { PrismaBillsRepository } from '@/repositories/prisma/prisma-bills-repository'

import { CreateBillUseCase } from '../create-bill'

export function makeCreateBillUseCase() {
	const accountsRepository = new PrismaBillsRepository()
	const useCase = new CreateBillUseCase(accountsRepository)

	return useCase
}

// import { PrismaBillsRepository } from '@/repositories/prisma/prisma-bills-repository'

import { DrizzleBillsRepository } from '@repositories/drizzle/drizzle-bills-repository'
import { CreateBillUseCase } from '../create-bill'

export function makeCreateBillUseCase() {
	// const accountsRepository = new PrismaBillsRepository()
	const accountsRepository = new DrizzleBillsRepository()
	const useCase = new CreateBillUseCase(accountsRepository)

	return useCase
}

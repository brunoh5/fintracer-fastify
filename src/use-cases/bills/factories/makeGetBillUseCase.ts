// import { PrismaBillsRepository } from '@/repositories/prisma/prisma-bills-repository'

import { DrizzleBillsRepository } from '@repositories/drizzle/drizzle-bills-repository'
import { GetBillUseCase } from '../get-bill'

export function makeGetBillUseCase() {
	// const billsRepository = new PrismaBillsRepository()
	const billsRepository = new DrizzleBillsRepository()
	const useCase = new GetBillUseCase(billsRepository)

	return useCase
}

// import { PrismaBillsRepository } from '@/repositories/prisma/prisma-bills-repository'

import { DrizzleBillsRepository } from '@repositories/drizzle/drizzle-bills-repository'
import { FetchBillsUseCase } from '../fetch-bills'

export function makeFetchBillUseCase() {
	// const billsRepository = new PrismaBillsRepository()
	const billsRepository = new DrizzleBillsRepository()
	const useCase = new FetchBillsUseCase(billsRepository)

	return useCase
}

import { PrismaBillsRepository } from '@/repositories/prisma/prisma-bills-repository'

import { FetchBillsUseCase } from '../fetch-bills'

export function makeFetchBillUseCase() {
	const billsRepository = new PrismaBillsRepository()
	const useCase = new FetchBillsUseCase(billsRepository)

	return useCase
}

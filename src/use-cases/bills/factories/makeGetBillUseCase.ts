import { PrismaBillsRepository } from '@/repositories/prisma/prisma-bills-repository'

import { GetBillUseCase } from '../get-bill'

export function makeGetBillUseCase() {
	const billsRepository = new PrismaBillsRepository()
	const useCase = new GetBillUseCase(billsRepository)

	return useCase
}

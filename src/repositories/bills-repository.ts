export type Bill = {
	id: string
	dueDate: Date | string
	title: string
	description?: string
	amount: number
	created_at: Date | string
	paid_at?: Date | string
	payment_method?: string | null
}

export type CreateOrUpdateBillRequest = {
	id?: string
	title: string
	description?: string
	amount: number
	paid_at?: Date | string
	userId?: string
}

export interface FindManyBillsProps {
	userId: string
	status?: string
	title?: string
	pageIndex: number
}

export interface FindManyBillsResponse {
	bills: Bill[]
	billsCount: number
	paidInCents: number
	notPaidInCents: number
}

export interface BillsRepository {
	findManyBills(data: FindManyBillsProps): Promise<FindManyBillsResponse>
	findById(id: string): Promise<Bill | null>
	update(data: CreateOrUpdateBillRequest): Promise<Bill>
	create(data: CreateOrUpdateBillRequest): Promise<Bill>
}

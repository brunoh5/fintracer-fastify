export type User = {
	id: string
	name: string
	email: string
	passwordHash?: string
}

export type CreateOrUpdateUserRequest = {
	id?: string
	name: string
	email: string
	passwordHash: string
}

export interface UsersRepository {
	changeUserCredentials(id: string, passwordHash: string): Promise<void>
	findById(id: string): Promise<User | null>
	findByEmail(email: string): Promise<User | null>
	create(data: CreateOrUpdateUserRequest): Promise<User>
	update(data: CreateOrUpdateUserRequest): Promise<User>
}

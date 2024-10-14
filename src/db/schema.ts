import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import {
	boolean,
	foreignKey,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/pg-core'

export const accountType = pgEnum('AccountType', [
	'CURRENT_ACCOUNT',
	'INVESTMENT_ACCOUNT',
	'SAVINGS_ACCOUNT',
	'MACHINE_ACCOUNT',
])
export const category = pgEnum('Category', [
	'HOME',
	'FOOD',
	'TRANSPORTATION',
	'ENTERTAINMENT',
	'SHOPPING',
	'OTHERS',
])
export const paymentMethod = pgEnum('PaymentMethod', [
	'MONEY',
	'PIX',
	'CREDIT_CARD',
	'DEBIT_CARD',
	'BANK_TRANSFER',
])
export const period = pgEnum('Period', ['ONLY', 'MONTHLY', 'ANUAL'])

export const prismaMigrations = pgTable('_prisma_migrations', {
	id: varchar('id', { length: 36 }).primaryKey().notNull(),
	checksum: varchar('checksum', { length: 64 }).notNull(),
	finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'string' }),
	migrationName: varchar('migration_name', { length: 255 }).notNull(),
	logs: text('logs'),
	rolledBackAt: timestamp('rolled_back_at', {
		withTimezone: true,
		mode: 'string',
	}),
	startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' })
		.defaultNow()
		.notNull(),
	appliedStepsCount: integer('applied_steps_count').default(0).notNull(),
})

export const users = pgTable(
	'users',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		name: text('name').notNull(),
		email: text('email').notNull(),
		passwordHash: text('password_hash').notNull(),
		createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		activeSubscription: boolean('activeSubscription'),
		stripeCustomerId: text('stripeCustomerId'),
		stripePriceId: text('stripePriceId'),
	},
	table => {
		return {
			emailKey: uniqueIndex('users_email_key').using(
				'btree',
				table.email.asc().nullsLast()
			),
		}
	}
)

export const accounts = pgTable(
	'accounts',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		balance: integer('balance').notNull().default(0),
		number: text('number'),
		bank: text('bank').notNull(),
		userId: text('userId').notNull(),
		type: accountType('type').default('CURRENT_ACCOUNT').notNull(),
	},
	table => {
		return {
			accountsUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [users.id],
				name: 'accounts_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		}
	}
)

export const transactions = pgTable(
	'transactions',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		name: text('name').notNull(),
		shopName: text('shopName'),
		amount: integer('amount').default(0).notNull(),
		date: timestamp('date', { withTimezone: true }).defaultNow(),
		paymentMethod: paymentMethod('payment_method').default('MONEY').notNull(),
		category: category('category').default('OTHERS').notNull(),
		accountId: text('accountId').notNull(),
		userId: text('userId').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	},
	table => {
		return {
			transactionsAccountIdFkey: foreignKey({
				columns: [table.accountId],
				foreignColumns: [accounts.id],
				name: 'transactions_accountId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			transactionsUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [users.id],
				name: 'transactions_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		}
	}
)

export const bills = pgTable(
	'bills',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		dueDate: timestamp('dueDate', { precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		title: text('title').notNull(),
		description: text('description'),
		amount: integer('amount').notNull(),
		createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		paidAt: timestamp('paid_at', { precision: 3, mode: 'string' }),
		userId: text('userId').notNull(),
		period: period('period').default('ONLY').notNull(),
		paidAmount: integer('paid_amount'),
		paymentMethod: paymentMethod('payment_method'),
	},
	table => {
		return {
			billsUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [users.id],
				name: 'bills_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		}
	}
)

export const goals = pgTable(
	'goals',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		name: text('name').notNull(),
		targetAmount: integer('targetAmount').default(0).notNull(),
		presentAmount: integer('presentAmount').default(0),
		createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		userId: text('userId').notNull(),
	},
	table => {
		return {
			goalsUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [users.id],
				name: 'goals_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		}
	}
)

import { relations } from "drizzle-orm/relations";
import { users, accounts, transactions, bills, goals } from "./schema";

export const accountsRelations = relations(accounts, ({one, many}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
	transactions: many(transactions),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	transactions: many(transactions),
	bills: many(bills),
	goals: many(goals),
}));

export const transactionsRelations = relations(transactions, ({one}) => ({
	account: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id]
	}),
	user: one(users, {
		fields: [transactions.userId],
		references: [users.id]
	}),
}));

export const billsRelations = relations(bills, ({one}) => ({
	user: one(users, {
		fields: [bills.userId],
		references: [users.id]
	}),
}));

export const goalsRelations = relations(goals, ({one}) => ({
	user: one(users, {
		fields: [goals.userId],
		references: [users.id]
	}),
}));
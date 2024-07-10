import {
	endOfDay,
	endOfMonth,
	startOfDay,
	startOfMonth,
	subMonths,
} from 'date-fns'

export function getFormattedDate() {
	const now = new Date()

	const startOfCurrentMonth = startOfMonth(now)
	const startOfLastMonth = startOfMonth(subMonths(now, 1))

	const endOfCurrentMonth = endOfMonth(now)
	const endOfLastMonth = endOfMonth(subMonths(now, 1))

	const startDate = startOfDay(now)
	const endDate = endOfDay(now)

	return {
		iso: {
			now: now.toISOString(),
			startOfCurrentMonth: startOfCurrentMonth.toISOString(),
			startOfLastMonth: startOfLastMonth.toISOString(),
			endOfCurrentMonth: endOfCurrentMonth.toISOString(),
			endOfLastMonth: endOfLastMonth.toISOString(),
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
		},
	}
}

import { format, isToday, differenceInMinutes, differenceInHours } from 'date-fns'
export default function (date) {
	const now = new Date()

	// Різниця в хвилинах
	const diffMinutes = differenceInMinutes(now, date)

	if (diffMinutes < 1) {
		return 'Just now'
	}

	// Різниця в годинах
	const diffHours = differenceInHours(now, date)

	if (diffHours < 1) {
		return 'Less than 1 hour ago'
	}

	// Якщо дата сьогодні
	if (isToday(date)) {
		return format(date, 'HH:mm') // Формат часу
	}

	// Всі інші випадки
	return format(date, 'yyyy-MM-dd HH:mm') // Повна дата і час
}

export function formatTimeInput(raw: string): string {
	let digits = raw.replace(/\D/g, '');
	if (digits.length > 0) {
		digits = digits.replace(/(\d{2})(\d{2})/, '$1:$2');
		digits = digits.slice(0, 5);
	}
	return digits;
}

export function parseTimeToMinutes(value: string): number | null {
	if (!/^\d{2}:\d{2}$/.test(value)) return null;
	const [hours, minutes] = value.split(':').map(Number);
	return hours * 60 + minutes;
}

export function formatKoreanTime(totalMinutes: number): string {
	const hour24 = Math.floor(totalMinutes / 60) % 24;
	const minute = totalMinutes % 60;
	const meridiem = hour24 < 12 ? '오전' : '오후';
	const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
	return `${meridiem} ${hour12}시 ${minute}분`;
}

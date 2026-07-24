function pad(value: number): string {
	return value.toString().padStart(2, '0');
}

function formatLocal(date: Date): string {
	return (
		`${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
		`T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
	);
}

function formatUtc(date: Date): string {
	return (
		`${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
		`T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
	);
}

/**
 * 이번주 금요일 퇴근시각 이벤트(.ics)를 만든다.
 * 알람은 10분 전·5분 전 두 개. 시각은 TZID 없는 로컬(floating) 시간으로 표기한다.
 */
export function buildQuittingIcs(quittingMinutes: number, now: Date): string {
	// 주 시작 일요일 기준 이번주 금요일 (기존 계산 로직과 동일한 기준)
	const friday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 5);
	const start = new Date(friday.getTime() + quittingMinutes * 60_000);
	const end = new Date(start.getTime() + 5 * 60_000);

	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//ise-utils//quitting-alarm//KO',
		'CALSCALE:GREGORIAN',
		'BEGIN:VEVENT',
		`UID:${now.getTime()}@ise-utils`,
		`DTSTAMP:${formatUtc(now)}`,
		`DTSTART:${formatLocal(start)}`,
		`DTEND:${formatLocal(end)}`,
		'SUMMARY:🍳 퇴근!',
		'BEGIN:VALARM',
		'ACTION:DISPLAY',
		'DESCRIPTION:퇴근 10분 전',
		'TRIGGER:-PT10M',
		'END:VALARM',
		'BEGIN:VALARM',
		'ACTION:DISPLAY',
		'DESCRIPTION:퇴근 5분 전',
		'TRIGGER:-PT5M',
		'END:VALARM',
		'END:VEVENT',
		'END:VCALENDAR',
	];
	return lines.join('\r\n') + '\r\n';
}

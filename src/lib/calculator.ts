export type Half = 0 | 1 | 2; // 0: 반차 없음, 1: 오전 반차, 2: 오후 반차

export interface CalcInput {
	workMinutes: number; // e-HR 총근로시간 (분)
	arrivalMinutes: number; // 금요일 출근시각 (자정 기준 분)
	offDays: number; // 이번주 쉬는 날 (0~4, 0.5 단위)
	half: Half;
	noCoreTime: boolean; // 코어 타임 제거
}

export interface CalcResult {
	quittingMinutes: number; // 금요일 자정 기준 분 (24h 초과 가능)
	error?: 'workTimeError';
}

const WEEKLY_HOURS = 41; // 주 40h + 점심 등 보정 1h (기존 구현 기준)

export function calcQuittingTime({ workMinutes, arrivalMinutes, offDays, half, noCoreTime }: CalcInput): CalcResult {
	const workHours = Math.floor(workMinutes / 60) + (half !== 0 ? 4 : 0);
	const workMins = workMinutes % 60;

	const minWorkHours = (half !== 0 ? 31 : 27) - offDays * 8;
	const error = workHours < minWorkHours ? ('workTimeError' as const) : undefined;

	let quittingMinutes =
		(WEEKLY_HOURS - offDays * 8 - workHours - (half === 1 ? 1 : 0)) * 60 - workMins + arrivalMinutes;

	const minQuittingMinutes = (half === 1 ? 0 : 16) * 60;
	if (!noCoreTime && quittingMinutes < minQuittingMinutes) {
		quittingMinutes = minQuittingMinutes;
	}

	return error ? { quittingMinutes, error } : { quittingMinutes };
}

const OFF_DAYS_PATTERN = /^(0|0\.|0\.5|1|1\.|1\.5|2|2\.|2\.5|3|3\.|3\.5|4)$/;

export function sanitizeOffDays(value: string, prev: string): string {
	let next: string;
	if (OFF_DAYS_PATTERN.test(value)) {
		next = value;
	} else if (value === '') {
		next = '';
	} else {
		next = prev;
	}

	if (Number(next) > 4) next = '4';
	else if (Number(next) < 0) next = '0';
	return next;
}

function clampCompleteTime(value: string, maxHours: number, minHours: number): string {
	if (value.length !== 5) return value;
	const hours = Math.max(Math.min(parseInt(value.split(':')[0], 10), maxHours), minHours);
	const minutes = Math.min(Number(value.split(':')[1]), 59);
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function clampWorkTime(value: string, offDays: number): string {
	return clampCompleteTime(value, 39 - offDays * 8, 27 - offDays * 8);
}

export function clampArrivalTime(value: string, half: Half): string {
	return clampCompleteTime(value, half === 2 ? 16 : 11, 0);
}

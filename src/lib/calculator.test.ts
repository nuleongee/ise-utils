import { describe, expect, it } from 'vitest';
import { calcQuittingTime, clampArrivalTime, clampWorkTime, sanitizeOffDays } from './calculator';

describe('calcQuittingTime', () => {
	it('기본 케이스: 31:50 근무, 07:57 출근 → 17:07 퇴근', () => {
		const r = calcQuittingTime({
			workMinutes: 31 * 60 + 50,
			arrivalMinutes: 7 * 60 + 57,
			offDays: 0,
			half: 0,
			noCoreTime: false,
		});
		expect(r.quittingMinutes).toBe(17 * 60 + 7);
		expect(r.error).toBeUndefined();
	});

	it('최소 퇴근 16:00으로 클램핑한다', () => {
		const r = calcQuittingTime({ workMinutes: 35 * 60, arrivalMinutes: 8 * 60, offDays: 0, half: 0, noCoreTime: false });
		expect(r.quittingMinutes).toBe(16 * 60);
	});

	it('코어타임 제거 시 16:00 클램핑을 하지 않는다', () => {
		const r = calcQuittingTime({ workMinutes: 35 * 60, arrivalMinutes: 8 * 60, offDays: 0, half: 0, noCoreTime: true });
		expect(r.quittingMinutes).toBe(14 * 60);
	});

	it('오전 반차: 근무시간 +4h, 점심 1h 차감, 최소퇴근 클램핑 없음', () => {
		const r = calcQuittingTime({ workMinutes: 28 * 60, arrivalMinutes: 11 * 60, offDays: 0, half: 1, noCoreTime: false });
		// 41 - (28+4) - 1 = 8h → 08:00 + 11:00 = 19:00
		expect(r.quittingMinutes).toBe(19 * 60);
	});

	it('오전 반차의 최소퇴근은 00:00으로 클램핑한다', () => {
		const r = calcQuittingTime({ workMinutes: 39 * 60, arrivalMinutes: 60, offDays: 0, half: 1, noCoreTime: false });
		// 41 - (39+4) - 1 = -3h → -180 + 60 = -120분 → 최소 00:00으로 클램핑
		expect(r.quittingMinutes).toBe(0);
	});

	it('오후 반차: 근무시간 +4h만 반영', () => {
		const r = calcQuittingTime({ workMinutes: 27 * 60, arrivalMinutes: 8 * 60, offDays: 0, half: 2, noCoreTime: false });
		// 41 - (27+4) = 10h → 10:00 + 08:00 = 18:00
		expect(r.quittingMinutes).toBe(18 * 60);
	});

	it('쉬는 날 0.5일은 4시간으로 차감한다', () => {
		const r = calcQuittingTime({ workMinutes: 27 * 60, arrivalMinutes: 9 * 60, offDays: 0.5, half: 0, noCoreTime: false });
		// 41 - 4 - 27 = 10h → 10:00 + 09:00 = 19:00
		expect(r.quittingMinutes).toBe(19 * 60);
	});

	it('총근로시간이 하한(27h - 쉬는날×8) 미만이면 workTimeError', () => {
		const r = calcQuittingTime({ workMinutes: 20 * 60, arrivalMinutes: 8 * 60, offDays: 0, half: 0, noCoreTime: false });
		expect(r.error).toBe('workTimeError');
	});

	it('반차 시 하한은 31h(반차 4h 포함 기준)', () => {
		const ok = calcQuittingTime({ workMinutes: 27 * 60, arrivalMinutes: 8 * 60, offDays: 0, half: 2, noCoreTime: false });
		expect(ok.error).toBeUndefined();
		const bad = calcQuittingTime({ workMinutes: 26 * 60 + 59, arrivalMinutes: 8 * 60, offDays: 0, half: 2, noCoreTime: false });
		expect(bad.error).toBe('workTimeError');
	});
});

describe('sanitizeOffDays', () => {
	it('0.5 단위 값을 허용한다', () => {
		expect(sanitizeOffDays('1.5', '')).toBe('1.5');
	});
	it('중간 입력(소수점까지)을 허용한다', () => {
		expect(sanitizeOffDays('1.', '1')).toBe('1.');
	});
	it('허용되지 않는 값은 이전 값으로 복원한다', () => {
		expect(sanitizeOffDays('1.7', '1.')).toBe('1.');
		expect(sanitizeOffDays('5', '')).toBe('');
	});
	it('빈값을 허용한다', () => {
		expect(sanitizeOffDays('', '2')).toBe('');
	});
});

describe('clampWorkTime', () => {
	it('시간부를 하한 27로 올린다', () => {
		expect(clampWorkTime('20:00', 0)).toBe('27:00');
	});
	it('시간부를 상한 39로 내린다', () => {
		expect(clampWorkTime('45:00', 0)).toBe('39:00');
	});
	it('쉬는 날만큼 범위가 내려간다 (offDays=1 → 19~31)', () => {
		expect(clampWorkTime('35:00', 1)).toBe('31:00');
		expect(clampWorkTime('10:00', 1)).toBe('19:00');
	});
	it('분은 59로 클램프한다', () => {
		expect(clampWorkTime('31:99', 0)).toBe('31:59');
	});
	it('미완성 입력은 그대로 반환한다', () => {
		expect(clampWorkTime('31:5', 0)).toBe('31:5');
		expect(clampWorkTime('', 0)).toBe('');
	});
});

describe('clampArrivalTime', () => {
	it('시간부 최대 11', () => {
		expect(clampArrivalTime('13:00', 0)).toBe('11:00');
	});
	it('오후 반차면 최대 16', () => {
		expect(clampArrivalTime('13:00', 2)).toBe('13:00');
		expect(clampArrivalTime('17:30', 2)).toBe('16:30');
	});
	it('분은 59로 클램프한다', () => {
		expect(clampArrivalTime('07:99', 0)).toBe('07:59');
	});
	it('미완성 입력은 그대로 반환한다', () => {
		expect(clampArrivalTime('07:5', 0)).toBe('07:5');
	});
});

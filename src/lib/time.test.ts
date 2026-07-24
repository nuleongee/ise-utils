import { describe, expect, it } from 'vitest';
import { formatKoreanTime, formatTimeInput, parseTimeToMinutes } from './time';

describe('formatTimeInput', () => {
	it('4자리 숫자에 콜론을 삽입한다', () => {
		expect(formatTimeInput('0757')).toBe('07:57');
	});
	it('숫자가 아닌 문자를 제거한다', () => {
		expect(formatTimeInput('07a5b7')).toBe('07:57');
	});
	it('5자를 초과하면 자른다', () => {
		expect(formatTimeInput('075712')).toBe('07:57');
	});
	it('3자리 이하는 콜론 없이 그대로 둔다', () => {
		expect(formatTimeInput('075')).toBe('075');
	});
	it('빈 문자열은 빈 문자열', () => {
		expect(formatTimeInput('')).toBe('');
	});
});

describe('parseTimeToMinutes', () => {
	it('HH:MM을 분으로 변환한다', () => {
		expect(parseTimeToMinutes('07:57')).toBe(477);
	});
	it('형식이 아니면 null', () => {
		expect(parseTimeToMinutes('0757')).toBeNull();
		expect(parseTimeToMinutes('7:57')).toBeNull();
		expect(parseTimeToMinutes('')).toBeNull();
	});
});

describe('formatKoreanTime', () => {
	it('오후 시각을 12시간제로 표시한다', () => {
		expect(formatKoreanTime(17 * 60 + 7)).toBe('오후 5시 7분');
	});
	it('정오는 오후 12시', () => {
		expect(formatKoreanTime(12 * 60)).toBe('오후 12시 0분');
	});
	it('오전 시각', () => {
		expect(formatKoreanTime(9 * 60 + 10)).toBe('오전 9시 10분');
	});
	it('24시간을 넘으면 래핑한다', () => {
		expect(formatKoreanTime(25 * 60 + 59)).toBe('오전 1시 59분');
	});
});

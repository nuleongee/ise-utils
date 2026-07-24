import { describe, expect, it } from 'vitest';
import { buildQuittingIcs } from './ics';

describe('buildQuittingIcs', () => {
	it('평일(월요일) 기준 이번주 금요일 날짜로 이벤트를 만든다', () => {
		const ics = buildQuittingIcs(17 * 60 + 7, new Date(2026, 6, 20, 10, 0, 0));
		expect(ics).toContain('DTSTART:20260724T170700');
	});

	it('금요일 당일 기준도 같은 금요일이다', () => {
		const ics = buildQuittingIcs(17 * 60 + 7, new Date(2026, 6, 24, 10, 0, 0));
		expect(ics).toContain('DTSTART:20260724T170700');
	});

	it('24시간을 넘으면 토요일로 넘어간다', () => {
		const ics = buildQuittingIcs(25 * 60, new Date(2026, 6, 24, 10, 0, 0));
		expect(ics).toContain('DTSTART:20260725T010000');
	});

	it('DTEND는 시작 5분 뒤다', () => {
		const ics = buildQuittingIcs(17 * 60 + 7, new Date(2026, 6, 24, 10, 0, 0));
		expect(ics).toContain('DTEND:20260724T171200');
	});

	it('10분 전·5분 전 알람 두 개를 포함한다', () => {
		const ics = buildQuittingIcs(17 * 60, new Date(2026, 6, 24, 10, 0, 0));
		expect(ics).toContain('TRIGGER:-PT10M');
		expect(ics).toContain('TRIGGER:-PT5M');
	});

	it('제목과 CRLF 줄바꿈을 사용한다', () => {
		const ics = buildQuittingIcs(17 * 60, new Date(2026, 6, 24, 10, 0, 0));
		expect(ics).toContain('SUMMARY:🍳 퇴근!');
		expect(ics).toContain('BEGIN:VCALENDAR\r\nVERSION:2.0');
	});
});

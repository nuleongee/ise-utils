import type { CalcResult } from '../lib/calculator';
import { buildQuittingIcs } from '../lib/ics';
import { formatKoreanTime } from '../lib/time';

interface Props {
	result: CalcResult | null;
}

function downloadIcs(quittingMinutes: number) {
	const blob = new Blob([buildQuittingIcs(quittingMinutes, new Date())], { type: 'text/calendar' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = 'quitting-alarm.ics';
	anchor.click();
	URL.revokeObjectURL(url);
}

export default function ResultCard({ result }: Props) {
	if (!result) return null;

	const hour = Math.floor(result.quittingMinutes / 60) % 24;
	if (hour < 10) {
		return <p className="text-xl text-red-500">총근로시간 확인 필요! 😡</p>;
	}
	if (result.error) return null;

	return (
		<div className="flex flex-col items-center gap-3">
			<p className="flex items-center justify-center gap-2 text-3xl text-grape-600">
				{formatKoreanTime(result.quittingMinutes)} 퇴근!
				<img src="/images/bye.gif" alt="bye" className="h-8 w-8" />
			</p>
			<button
				type="button"
				onClick={() => downloadIcs(result.quittingMinutes)}
				className="rounded-full border border-ink-700/20 bg-transparent px-4 py-0.5 text-base transition-colors hover:bg-ink-700/5 active:translate-y-px">
				📅 캘린더에 알림 등록 (10분·5분 전)
			</button>
		</div>
	);
}

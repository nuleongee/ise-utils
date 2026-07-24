import type { CalcResult } from '../lib/calculator';
import { formatKoreanTime } from '../lib/time';

interface Props {
	result: CalcResult | null;
}

export default function ResultCard({ result }: Props) {
	if (!result) return null;

	const hour = Math.floor(result.quittingMinutes / 60) % 24;
	if (hour < 10) {
		return <p className="text-xl">총근로시간 확인 필요! 😡</p>;
	}
	if (result.error) return null;

	return (
		<p className="flex items-center gap-2 text-2xl">
			{formatKoreanTime(result.quittingMinutes)} 퇴근!
			<img src="/images/bye.gif" alt="bye" className="h-8 w-8" />
		</p>
	);
}

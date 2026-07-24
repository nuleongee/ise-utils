import { useState } from 'react';
import { calcQuittingTime, clampArrivalTime, clampWorkTime, sanitizeOffDays, type Half } from './lib/calculator';
import { formatTimeInput, parseTimeToMinutes } from './lib/time';
import CoreTimeToggle from './components/CoreTimeToggle';
import GuideTooltip from './components/GuideTooltip';
import HalfDayToggle from './components/HalfDayToggle';
import LaborInputs from './components/LaborInputs';
import ResultCard from './components/ResultCard';

export default function App() {
	const [offDays, setOffDays] = useState('');
	const [workTime, setWorkTime] = useState('');
	const [arrivalTime, setArrivalTime] = useState('');
	const [half, setHalf] = useState<Half>(0);
	const [noCoreTime, setNoCoreTime] = useState(false);

	const offDaysNumber = Number(offDays) || 0;

	function handleOffDaysChange(value: string) {
		const next = sanitizeOffDays(value, offDays);
		setOffDays(next);
		setWorkTime(prev => clampWorkTime(prev, Number(next) || 0));
	}

	function handleWorkTimeChange(value: string) {
		setWorkTime(clampWorkTime(formatTimeInput(value), offDaysNumber));
	}

	function handleArrivalTimeChange(value: string) {
		setArrivalTime(clampArrivalTime(formatTimeInput(value), half));
	}

	function handleHalfToggle(type: 1 | 2) {
		const next: Half = half === type ? 0 : type;
		setHalf(next);
		setArrivalTime(prev => clampArrivalTime(prev, next));
	}

	const workMinutes = parseTimeToMinutes(workTime);
	const arrivalMinutes = parseTimeToMinutes(arrivalTime);
	const result =
		workMinutes !== null && arrivalMinutes !== null
			? calcQuittingTime({ workMinutes, arrivalMinutes, offDays: offDaysNumber, half, noCoreTime })
			: null;
	// ResultCard가 실제로 콘텐츠를 렌더링하는 조건과 동일하게 맞춰서 카드 프레임도 그때만 렌더한다.
	const showResultCard = result !== null && (Math.floor(result.quittingMinutes / 60) % 24 < 10 || !result.error);

	return (
		<div className="flex min-h-dvh flex-col">
			<a href="https://ehr.i-screamedu.co.kr" target="_blank" rel="noreferrer noopener">
				<header className="mt-8 text-center text-[clamp(1.8rem,8dvw,3.2rem)]">🍳 금요일 퇴근시간 계산기</header>
			</a>

			<main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 p-4 text-[clamp(1rem,4.3dvw,1.4rem)]">
				<GuideTooltip />
				<section className="w-full rounded-2xl border border-ink-700/10 bg-white/70 p-4 shadow-sm sm:p-6">
					<LaborInputs
						offDays={offDays}
						workTime={workTime}
						arrivalTime={arrivalTime}
						onOffDaysChange={handleOffDaysChange}
						onWorkTimeChange={handleWorkTimeChange}
						onArrivalTimeChange={handleArrivalTimeChange}
					/>
					<div className="mt-3 grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-3 sm:gap-x-3">
						<span className="text-right">반차 사용</span>
						<HalfDayToggle half={half} onToggle={handleHalfToggle} />
						<span className="text-right">코어 타임 제거</span>
						<CoreTimeToggle noCoreTime={noCoreTime} onToggle={() => setNoCoreTime(v => !v)} />
					</div>
				</section>
				{showResultCard && (
					<section className="w-full rounded-2xl border border-grape-400/30 bg-white/70 p-4 text-center shadow-sm sm:p-6">
						<ResultCard result={result} />
					</section>
				)}
			</main>

			<footer className="p-3 text-center font-bold">Nuleongee's ISE Utils</footer>
		</div>
	);
}

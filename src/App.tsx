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
				<header className="mt-8 text-center text-[clamp(1.8rem,8dvw,3.2rem)]">
					<span className="relative inline-block">
						🍳 금요일 퇴근시간 계산기
						<svg
							aria-hidden
							viewBox="0 0 200 10"
							preserveAspectRatio="none"
							className="absolute -bottom-2 left-[10%] h-[0.35em] w-[80%]">
							<path
								d="M3 7 Q 50 2 100 6 T 197 4"
								fill="none"
								stroke="var(--color-egg-400)"
								strokeWidth="4"
								strokeLinecap="round"
							/>
						</svg>
					</span>
				</header>
			</a>

			<main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 p-4 pb-[18dvh] text-[clamp(1rem,4.3dvw,1.4rem)]">
				<GuideTooltip />
				<div className="rise-in relative w-full">
					<div
						aria-hidden
						className="absolute inset-0 rotate-[1.2deg] rounded-2xl border border-ink-700/10 bg-white/50"
					/>
					<div
						aria-hidden
						className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 rounded-sm bg-egg-300/60 shadow-sm"
					/>
					<section className="relative w-full rounded-2xl border border-ink-700/10 bg-white/80 p-6 shadow-sm sm:p-8">
						<div className="grid grid-cols-[max-content_max-content] items-center justify-center gap-x-3 gap-y-4 sm:gap-x-4">
							<LaborInputs
								offDays={offDays}
								workTime={workTime}
								arrivalTime={arrivalTime}
								onOffDaysChange={handleOffDaysChange}
								onWorkTimeChange={handleWorkTimeChange}
								onArrivalTimeChange={handleArrivalTimeChange}
							/>
							<span className="text-right">반차 사용</span>
							<HalfDayToggle half={half} onToggle={handleHalfToggle} />
							<span className="text-right">코어 타임 제거</span>
							<CoreTimeToggle noCoreTime={noCoreTime} onToggle={() => setNoCoreTime(v => !v)} />
						</div>
					</section>
				</div>
				{showResultCard && (
					<section className="rise-in w-full rounded-2xl border border-grape-400/30 bg-white/70 p-4 text-center shadow-sm sm:p-6">
						<ResultCard result={result} />
					</section>
				)}
			</main>

			<footer className="p-3 text-center font-bold">Nuleongee's ISE Utils</footer>
		</div>
	);
}

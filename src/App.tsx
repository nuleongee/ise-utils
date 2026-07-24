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

	return (
		<div className="flex min-h-dvh flex-col">
			<a href="https://ehr.i-screamedu.co.kr" target="_blank" rel="noreferrer noopener">
				<header className="mt-8 text-center text-4xl">🍳 금요일 퇴근시간 계산기</header>
			</a>

			<main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 p-4">
				<GuideTooltip />
				<LaborInputs
					offDays={offDays}
					workTime={workTime}
					arrivalTime={arrivalTime}
					onOffDaysChange={handleOffDaysChange}
					onWorkTimeChange={handleWorkTimeChange}
					onArrivalTimeChange={handleArrivalTimeChange}
				/>
				<div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3">
					<span className="text-right">반차 사용</span>
					<HalfDayToggle half={half} onToggle={handleHalfToggle} />
					<span className="text-right">코어 타임 제거</span>
					<CoreTimeToggle noCoreTime={noCoreTime} onToggle={() => setNoCoreTime(v => !v)} />
				</div>
				<ResultCard result={result} />
			</main>

			<footer className="p-3 text-center font-bold">Nuleongee's ISE Utils</footer>
		</div>
	);
}

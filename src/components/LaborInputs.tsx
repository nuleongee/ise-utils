interface Props {
	offDays: string;
	workTime: string;
	arrivalTime: string;
	onOffDaysChange: (value: string) => void;
	onWorkTimeChange: (value: string) => void;
	onArrivalTimeChange: (value: string) => void;
}

const inputClass =
	'w-40 border-0 border-b border-ink-700/25 bg-transparent px-1 py-1 transition-colors focus:border-grape-500 focus:bg-grape-500/5 focus:outline-none';

export default function LaborInputs({
	offDays,
	workTime,
	arrivalTime,
	onOffDaysChange,
	onWorkTimeChange,
	onArrivalTimeChange,
}: Props) {
	return (
		<>
			<label htmlFor="offDays" className="text-right">
				이번주 쉬는 날
			</label>
			<input
				id="offDays"
				type="text"
				inputMode="decimal"
				value={offDays}
				onChange={e => onOffDaysChange(e.target.value)}
				placeholder="0.5 단위로 입력"
				className={inputClass}
			/>
			<label htmlFor="workTime" className="text-right">
				<span className="text-red-500">*</span>e-HR의 총근로시간 입력
			</label>
			<input
				id="workTime"
				type="text"
				inputMode="numeric"
				value={workTime}
				onChange={e => onWorkTimeChange(e.target.value)}
				placeholder="31:50"
				className={inputClass}
			/>
			<label htmlFor="arrivalTime" className="text-right">
				<span className="text-red-500">*</span>e-HR의 출근기록 입력
			</label>
			<input
				id="arrivalTime"
				type="text"
				inputMode="numeric"
				value={arrivalTime}
				onChange={e => onArrivalTimeChange(e.target.value)}
				placeholder="07:57"
				className={inputClass}
			/>
		</>
	);
}

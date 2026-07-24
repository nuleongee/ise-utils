interface Props {
	offDays: string;
	workTime: string;
	arrivalTime: string;
	onOffDaysChange: (value: string) => void;
	onWorkTimeChange: (value: string) => void;
	onArrivalTimeChange: (value: string) => void;
}

const inputClass = 'w-36 rounded-lg border border-egg-300 bg-white px-3 py-1 focus:outline-grape-400';

export default function LaborInputs({
	offDays,
	workTime,
	arrivalTime,
	onOffDaysChange,
	onWorkTimeChange,
	onArrivalTimeChange,
}: Props) {
	return (
		<div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3">
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
		</div>
	);
}

interface Props {
	noCoreTime: boolean;
	onToggle: () => void;
}

export default function CoreTimeToggle({ noCoreTime, onToggle }: Props) {
	return (
		<button
			type="button"
			aria-pressed={noCoreTime}
			onClick={onToggle}
			className={`min-w-16 rounded-lg border border-egg-300 px-3 py-1 transition-colors active:translate-y-px ${
				noCoreTime ? 'bg-grape-500 text-white' : 'bg-cream-100 hover:bg-egg-300'
			}`}>
			{noCoreTime ? 'on' : 'off'}
		</button>
	);
}

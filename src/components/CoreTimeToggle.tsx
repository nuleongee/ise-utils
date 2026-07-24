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
			className={`w-fit min-w-16 rounded-lg border border-ink-700/15 px-3 py-1 transition-colors active:translate-y-px ${
				noCoreTime ? 'bg-grape-500 text-white' : 'bg-white hover:bg-ink-700/5'
			}`}>
			{noCoreTime ? 'on' : 'off'}
		</button>
	);
}

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
			className={`w-fit min-w-16 rounded-full border px-4 py-0.5 transition-colors active:translate-y-px ${
				noCoreTime ? 'border-grape-500 bg-grape-500 text-white' : 'border-ink-700/20 bg-transparent hover:bg-ink-700/5'
			}`}>
			{noCoreTime ? 'on' : 'off'}
		</button>
	);
}

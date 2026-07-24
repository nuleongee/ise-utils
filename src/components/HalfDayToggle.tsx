import type { Half } from '../lib/calculator';

interface Props {
	half: Half;
	onToggle: (type: 1 | 2) => void;
}

function buttonClass(active: boolean): string {
	return `rounded-full border px-4 py-0.5 transition-colors active:translate-y-px ${
		active ? 'border-grape-500 bg-grape-500 text-white' : 'border-ink-700/20 bg-transparent hover:bg-ink-700/5'
	}`;
}

export default function HalfDayToggle({ half, onToggle }: Props) {
	return (
		<div className="flex w-fit gap-2">
			<button type="button" aria-pressed={half === 1} onClick={() => onToggle(1)} className={buttonClass(half === 1)}>
				오전
			</button>
			<button type="button" aria-pressed={half === 2} onClick={() => onToggle(2)} className={buttonClass(half === 2)}>
				오후
			</button>
		</div>
	);
}

import type { Half } from '../lib/calculator';

interface Props {
	half: Half;
	onToggle: (type: 1 | 2) => void;
}

function buttonClass(active: boolean): string {
	return `px-3 py-1 transition-colors ${active ? 'bg-grape-500 text-white' : 'bg-cream-100 hover:bg-egg-300'}`;
}

export default function HalfDayToggle({ half, onToggle }: Props) {
	return (
		<div className="flex overflow-hidden rounded-lg border border-egg-300">
			<button type="button" aria-pressed={half === 1} onClick={() => onToggle(1)} className={buttonClass(half === 1)}>
				오전
			</button>
			<button type="button" aria-pressed={half === 2} onClick={() => onToggle(2)} className={buttonClass(half === 2)}>
				오후
			</button>
		</div>
	);
}

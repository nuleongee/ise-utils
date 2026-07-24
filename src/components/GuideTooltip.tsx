import { useState } from 'react';

export default function GuideTooltip() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative flex justify-center">
			<button
				type="button"
				className="cursor-pointer text-gray-500"
				onPointerEnter={e => e.pointerType === 'mouse' && setIsOpen(true)}
				onPointerLeave={e => e.pointerType === 'mouse' && setIsOpen(false)}
				onPointerUp={e => e.pointerType !== 'mouse' && setIsOpen(open => !open)}
				onClick={e => e.detail === 0 && setIsOpen(open => !open)}
				onKeyDown={e => e.key === 'Escape' && setIsOpen(false)}
				onBlur={() => setIsOpen(false)}>
				사용법 🤔
			</button>
			{isOpen && (
				<picture className="pointer-events-none absolute left-1/2 top-8 z-10 w-[min(90dvw,64rem)] -translate-x-1/2">
					<source media="(max-width: 640px)" srcSet="/images/guide-m.webp" />
					<img src="/images/guide.webp" alt="사용법 안내" className="w-full" />
				</picture>
			)}
		</div>
	);
}

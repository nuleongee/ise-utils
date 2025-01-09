<script>
	import { base } from '$app/paths';
	import dayjs from 'dayjs';
	import clsx from 'clsx';
	import Device from 'svelte-device-info';

	import 'dayjs/locale/ko';
	dayjs.locale('ko');

	let workTimeAmount = '',
		arrivalTime = '',
		quittingTime,
		offDays = 0,
		prefOffDays = 0,
		error = '',
		isGuideShow = false,
		isMobile = false,
		orientation = 0,
		half = 0; // 0: 반차 X, 1: 오전 반차, 2: 오후 반차

	function guideShow() {
		isMobile = Device.isMobile;
		isGuideShow = true;
		orientation = window.orientation;
	}
	function guideHidden() {
		isGuideShow = false;
	}

	function handleOffDaysInput(event) {
		const regex = /^(0|0\.|0\.5|1|1\.|1\.5|2|2\.|2\.5|3|3\.|3\.5|4)$/;
		if (regex.test(event.target.value)) {
			offDays = event.target.value;
		} else if (event.target.value === '') {
			offDays = '';
		} else {
			offDays = prefOffDays;
		}

		if (offDays > 4) {
			offDays = 4;
		} else if (offDays < 0) {
			offDays = 0;
		}

		prefOffDays = offDays;
	}

	function handleHalfClick(type) {
		if (half === type) {
			half = 0;
		} else {
			half = type;
		}
	}

	function handleWorkTimeInput(event) {
		let formattedTime = event.target.value;

		formattedTime = formattedTime.replace(/\D/g, '');

		if (formattedTime.length > 0) {
			formattedTime = formattedTime.replace(/(\d{2})(\d{2})/, '$1:$2');
			formattedTime = formattedTime.slice(0, 5);
		}

		workTimeAmount = formattedTime;
	}

	$: if (workTimeAmount.length === 5) {
		let hours = Math.max(Math.min(parseInt(workTimeAmount.split(':')[0]), 39 - offDays * 8), 27 - offDays * 8);
		let minutes = Math.min(Number(workTimeAmount.split(':')[1]), 59);

		workTimeAmount = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
	}

	function handleArrivalTimeInput(event) {
		let formattedTime = event.target.value;

		formattedTime = formattedTime.replace(/\D/g, '');

		if (formattedTime.length > 0) {
			formattedTime = formattedTime.replace(/(\d{2})(\d{2})/, '$1:$2');
			formattedTime = formattedTime.slice(0, 5);
		}

		arrivalTime = formattedTime;
	}

	$: if (arrivalTime.length === 5) {
		let hours = Math.min(parseInt(arrivalTime.split(':')[0]), half === 2 ? 16 : 11);
		let minutes = Math.min(Number(arrivalTime.split(':')[1]), 59);

		arrivalTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
	}

	$: {
		let workTimeHours = parseInt(workTimeAmount.split(':')[0]) + (half !== 0 ? 4 : 0);
		let workTimeMinutes = parseInt(workTimeAmount.split(':')[1]);

		if (workTimeHours < (half !== 0 ? 31 : 27) - offDays * 8) {
			error = 'workTimeError';
		} else {
			error = '';
		}

		let arrivalTimeHours = parseInt(arrivalTime.split(':')[0]);
		let arrivalTimeMinutes = parseInt(arrivalTime.split(':')[1]);

		let baseTime = dayjs().startOf('week').add(5, 'day');

		quittingTime = baseTime
			.add(41 - offDays * 8 - workTimeHours - (half === 1 ? 1 : 0), 'hour')
			.subtract(workTimeMinutes, 'minute')
			.add(arrivalTimeHours, 'hour')
			.add(arrivalTimeMinutes, 'minute');

		let minQuittingTime = baseTime.add(half === 1 ? 0 : 16, 'hour');

		if (quittingTime < minQuittingTime) {
			quittingTime = minQuittingTime;
		}
	}
</script>

<svelte:head>
	<title>🍳 금요일 퇴근시간 계산기</title>
	<meta property="og:image" content="{base}/images/bye.gif" />
	<meta property="og:title" content="🍦아이스크림에듀 퇴근시간 계산기" />
	<meta name="description" content="🍦아이스크림에듀 퇴근시간 계산기" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link href="https://fonts.googleapis.com/css2?family=Gamja+Flower&display=swap" rel="stylesheet" />
</svelte:head>

<section>
	<span class="guide relative mb-5 cursor-pointer text-gray-500" on:mouseenter={guideShow} on:mouseleave={guideHidden}
		>사용법 🤔
	</span>
	<img
		class={clsx('guide-img absolute  pointer-events-none w-full', {
			hidden: !isGuideShow,
			'top-20': orientation === 0 || orientation === 180,
			'-top-20': orientation === 90 || orientation === 270,
		})}
		src="{base}/images/{isMobile ? 'guide-m' : 'guide'}.webp"
		alt="guide" />
	<span>
		<label for="arrivalTime"
			>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;이번주 쉬는 날</label>
		<input id="offDays" type="text" bind:value={offDays} on:input={handleOffDaysInput} placeholder="0.5 단위로 입력" />
	</span>
	<br />
	<span>
		<label for="workTime">e-HR의 총근로시간 입력</label>
		<input id="workTime" type="text" bind:value={workTimeAmount} on:input={handleWorkTimeInput} placeholder="31:50" />
	</span>
	<br />
	<span>
		<label for="arrivalTime">&nbsp;&nbsp;&nbsp;e-HR의 출근기록 입력</label>
		<input
			id="arrivalTime"
			type="text"
			bind:value={arrivalTime}
			on:input={handleArrivalTimeInput}
			placeholder="07:57" />
	</span>
	<br />
	<span>
		<label>&nbsp;&nbsp;반차 사용</label>
		<div class="buttonWrap">
			<button class={`half ${half === 1 && 'on'}`} on:click={() => handleHalfClick(1)}>오전</button>
			<button class={`half ${half === 2 && 'on'}`} on:click={() => handleHalfClick(2)}>오후</button>
		</div>
	</span>
	<br />
	{#if quittingTime.hour() < 10}
		<span>총근로시간 확인 필요! 😡</span>
	{/if}
	{#if !error && Number.isInteger(quittingTime.hour()) && quittingTime.hour() > 10 && Number.isInteger(quittingTime.minute())}
		<span>
			{dayjs(quittingTime).format('a h시 m분 퇴근!')}
			<img class="bye" src="{base}/images/bye.gif" alt="bye" />
		</span>
	{/if}
</section>

<style lang="postcss">
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		font-size: clamp(0.9rem, 4.3dvw, 1.6rem);
		position: relative;
	}

	section > span {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		width: 90dvw;
	}

	label {
		text-align: right;
		max-width: 50dvw;
		min-width: 18dvw;
		white-space: nowrap;
	}
	input,
	.buttonWrap {
		max-width: 18dvw;
		margin-left: 2dvw;
	}

	img.bye {
		width: clamp(1.1rem, 5dvw, 2rem);
		height: clamp(1.1rem, 5dvw, 2rem);
	}

	.guide {
		display: inline-block;
		width: auto;
		text-align: center;
	}
	.guide-img {
	}

	.buttonWrap {
		display: flex;
		flex-flow: row nowrap;
		gap: 0.1rem;
		min-width: 15dvw;
	}
	button.half {
		background: #e0e0e0;
		padding: 0 0.25rem;

		&:hover {
			background: #d0d0d0;
		}
		&:active {
			transform: translateY(1px);
		}
		&:first-child {
			border-radius: 0.25rem 0 0 0.25rem;
		}
		&:last-child {
			border-radius: 0 0.25rem 0.25rem 0;
		}

		&.on {
			background: #a15ff3;
			color: white;
		}
	}
</style>

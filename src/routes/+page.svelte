<script>
	import dayjs from 'dayjs';

	let workTimeAmount = '',
		arrivalTime = '',
		quittingTime,
		error;

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
		let hours = Math.max(Math.min(parseInt(workTimeAmount.split(':')[0]), 49), 37);
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
		let hours = Math.min(parseInt(arrivalTime.split(':')[0]), 11);
		let minutes = Math.min(Number(arrivalTime.split(':')[1]), 59);

		arrivalTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
	}

	$: {
		let workTimeHours = parseInt(workTimeAmount.split(':')[0]);
		let workTimeMinutes = parseInt(workTimeAmount.split(':')[1]);

		if (workTimeHours < 37) {
			error = 'workTimeError';
		} else {
			error = '';
		}

		let arrivalTimeHours = parseInt(arrivalTime.split(':')[0]);
		let arrivalTimeMinutes = parseInt(arrivalTime.split(':')[1]);

		let baseTime = dayjs().startOf('week').add(5, 'day');

		quittingTime = baseTime
			.add(51 - workTimeHours, 'hour')
			.subtract(workTimeMinutes, 'minute')
			.add(arrivalTimeHours, 'hour')
			.add(arrivalTimeMinutes, 'minute');

		let minQuittingTime = baseTime.add(16, 'hour');

		if (quittingTime < minQuittingTime) {
			quittingTime = minQuittingTime;
		}
	}
</script>

<svelte:head>
	<title>🍳 금요일 퇴근시간 계산기</title>
	<meta name="description" content="🍦아이스크림에듀 퇴근시간 계산기" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link href="https://fonts.googleapis.com/css2?family=Gamja+Flower&display=swap" rel="stylesheet" />
</svelte:head>

<section>
	<span>
		<label for="workTime">e-HR의 총근로시간 입력</label>
		<input id="workTime" type="text" bind:value={workTimeAmount} on:input={handleWorkTimeInput} placeholder="00:00" />
	</span>
	<br />
	<span>
		<label for="arrivalTime">&nbsp;&nbsp;&nbsp;e-HR의 출근기록 입력</label>
		<input
			id="arrivalTime"
			type="text"
			bind:value={arrivalTime}
			on:input={handleArrivalTimeInput}
			placeholder="00:00"
		/>
	</span>
	<br />
	{#if quittingTime.hour() - 12 < 0}
		<span>총근로시간 확인 필요! 😡</span>
	{/if}
	{#if !error && Number.isInteger(quittingTime.hour()) && quittingTime.hour() - 12 > 0 && Number.isInteger(quittingTime.minute())}
		<span
			>{quittingTime.hour() - 12}시 {quittingTime.minute().toString().padStart(2, '0')}분 퇴근!
			<img src="/images/wave.gif" alt="wave" /></span
		>
	{/if}
</section>

<style lang="postcss">
	:global(html) {
	}
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		font-size: clamp(0.9rem, 4.3dvw, 1.6rem);
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
	input {
		max-width: 18dvw;
		margin-left: 2dvw;
	}

	img {
		width: clamp(1.1rem, 5dvw, 2rem);
		height: clamp(1.1rem, 5dvw, 2rem);
	}
</style>

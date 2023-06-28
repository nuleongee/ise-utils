<script>
	let workTimeAmount = '',
		arrivalTime = '';

	function handleWorkTimeInput(event) {
		let formattedTime = event.target.value;

		// Remove any non-numeric characters from the input value
		formattedTime = formattedTime.replace(/\D/g, '');

		// Format the time as "hh:mm"
		if (formattedTime.length > 0) {
			formattedTime = formattedTime.replace(/(\d{2})(\d{2})/, '$1:$2');
			formattedTime = formattedTime.slice(0, 5);
		}

		workTimeAmount = formattedTime;
	}

	$: if (workTimeAmount.length === 5) {
		let hours = Math.min(parseInt(workTimeAmount.split(':')[0]), 49);
		let minutes = Math.min(Number(workTimeAmount.split(':')[1]), 59);

		workTimeAmount = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
	}

	function handleArrivalTimeInput(event) {
		let formattedTime = event.target.value;

		// Remove any non-numeric characters from the input value
		formattedTime = formattedTime.replace(/\D/g, '');

		// Format the time as "hh:mm"
		if (formattedTime.length > 0) {
			formattedTime = formattedTime.replace(/(\d{2})(\d{2})/, '$1:$2');
			formattedTime = formattedTime.slice(0, 5);
		}

		arrivalTime = formattedTime;
	}

	$: if (arrivalTime.length === 5) {
		let hours = Math.min(parseInt(arrivalTime.split(':')[0]), 10);
		let minutes = Math.min(Number(arrivalTime.split(':')[1]), 59);

		arrivalTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
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
		<a href="https://ehr.i-screamedu.co.kr" target="_blank" rel="noreferrer noopener">e-HR의 총근로시간 입력</a>
		<input type="text" bind:value={workTimeAmount} on:input={handleWorkTimeInput} placeholder="00:00" />
	</span>
	<br />
	<span>
		<a href="https://ehr.i-screamedu.co.kr" target="_blank" rel="noreferrer noopener">e-HR의 출근기록 입력</a>
		<input type="text" bind:value={arrivalTime} on:input={handleArrivalTimeInput} placeholder="00:00" />
	</span>
	<br />
	<span>00시 00분 퇴근! 👋</span>
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
	}

	h1 {
		width: 100%;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>

<script>
	import SveltyPicker from 'svelty-picker';

	let myDate = '00:00';
</script>

<svelte:head>
	<title>🍳 금요일 퇴근시간 계산기</title>
	<meta name="description" content="🍦아이스크림에듀 퇴근시간 계산기" />
</svelte:head>

<section>
	<!--	<h1 class="text-3xl font-bold underline">-->
	<!--		<span class="welcome">-->
	<!--			<picture>-->
	<!--				<source srcset={welcome} type="image/webp" />-->
	<!--				<img src={welcome_fallback} alt="Welcome" />-->
	<!--			</picture>-->
	<!--		</span>-->

	<!--		to your new<br />SvelteKit app-->
	<!--	</h1>-->

	<!--	<h2>-->
	<!--		try editing <strong>src/routes/+page.svelte</strong>-->
	<!--	</h2>-->

	<!--	<Counter />-->
	<span>
		<a href="https://ehr.i-screamedu.co.kr" target="_blank" rel="noreferrer noopener">e-HR의 총근로시간 입력</a>
		<input type="number" />
	</span>
	<br />
	<span>
		<a href="https://ehr.i-screamedu.co.kr" target="_blank" rel="noreferrer noopener">e-HR의 출근기록 입력</a>
		<SveltyPicker inputClasses="form-control" format="hh:ii" bind:value={myDate} />
	</span>
	<br />
	<span>00시 00분 퇴근! 👋</span>
</section>

<style lang="postcss">
	:global(html) {
		/*background-color: theme(colors.red.100);*/
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

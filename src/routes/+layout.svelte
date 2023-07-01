<script>
	import './styles.css';
	import '../app.css';
</script>

<div class="app">
	<!--	<Header />-->
	<a href="https://ehr.i-screamedu.co.kr" target="_blank" rel="noreferrer noopener">
		<header>🍳 금요일 퇴근시간 계산기</header>
	</a>

	<main>
		<slot />
	</main>

	<footer>
		<p>Nuleongee's ISE Utils</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100dvh;
	}

	header {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		margin-top: 2rem;
		font-size: clamp(1.5rem, 10dvw, 3.5rem);
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem 0;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>

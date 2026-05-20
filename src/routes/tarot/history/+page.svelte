<script>
	let { data } = $props();
	const history = data.history;

	function formatDate(isoString) {
		const date = new Date(isoString);
		return date.toLocaleString('th-TH', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="history-container">
	<header class="header">
		<a href="/tarot" class="btn-back">← กลับไปเลือกไพ่</a>
		<h1>ประวัติการทำนาย</h1>
	</header>

	<main class="history-list">
		{#if history.length === 0}
			<div class="empty-state">
				<p>ยังไม่มีประวัติการทำนาย</p>
				<a href="/tarot" class="btn-start">เริ่มทำนายเลย</a>
			</div>
		{:else}
			{#each history as item (item.id)}
				<div class="history-item">
					<div class="item-header">
						<span class="date">{formatDate(item.timestamp)}</span>
					</div>
					<div class="item-cards">
						{#each item.cards as card (card.id)}
							<div class="card-thumb">
								<img src={card.imageUrl} alt={card.nameTh} class:reversed={card.isReversed} />
								<span class="card-name dark:text-slate-400">{card.nameTh}</span>
							</div>
						{/each}
					</div>
					{#if item.question && item.question !== 'ภาพรวม'}
						<div class="item-question dark:bg-indigo-900/30 dark:text-indigo-200">
							<strong>คำถาม:</strong>
							{item.question}
						</div>
					{/if}
					{#if item.aiSummary}
						<div class="item-summary dark:bg-slate-800 dark:text-slate-300">
							<h4 class="dark:text-white">คำทำนาย:</h4>
							<div class="summary-content">
								{#each item.aiSummary.split('\n') as paragraph, i (i)}
									<p>{paragraph}</p>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</main>
</div>

<style>
	:global(body) {
		background-color: #f5f5f5;
		font-family: 'Sarabun', sans-serif;
	}

	:global(.dark body) {
		background-color: #0f172a;
	}

	.history-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.btn-back {
		text-decoration: none;
		color: #6366f1;
		font-weight: bold;
	}

	.history-item {
		background: white;
		border-radius: 16px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		border: 1px solid #e2e8f0;
	}

	:global(.dark) .history-item {
		background: #1e293b;
		border-color: #334155;
	}

	.item-header {
		margin-bottom: 1.25rem;
		color: #64748b;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.item-cards {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.card-thumb {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 70px;
	}

	.card-thumb img {
		width: 100%;
		border-radius: 6px;
		margin-bottom: 0.4rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.card-thumb img.reversed {
		transform: rotate(180deg);
	}

	.card-name {
		font-size: 0.65rem;
		text-align: center;
		color: #475569;
		line-height: 1.2;
	}

	.item-question {
		background: #eef2ff;
		padding: 0.75rem 1rem;
		border-radius: 10px;
		margin-bottom: 1rem;
		font-size: 0.9rem;
		color: #4338ca;
		border-left: 4px solid #6366f1;
	}

	.item-summary {
		background: #f8fafc;
		padding: 1.25rem;
		border-radius: 12px;
		font-size: 0.95rem;
		color: #334155;
		line-height: 1.6;
	}

	.item-summary h4 {
		margin: 0 0 0.5rem 0;
		color: #1e293b;
		font-size: 1rem;
	}

	.summary-content p {
		margin: 0.5rem 0;
	}

	.empty-state {
		text-align: center;
		padding: 5rem 0;
		color: #64748b;
	}

	.btn-start {
		display: inline-block;
		margin-top: 1.5rem;
		background: #6366f1;
		color: white;
		text-decoration: none;
		padding: 0.75rem 2rem;
		border-radius: 12px;
		font-weight: bold;
		transition: all 0.2s;
	}

	.btn-start:hover {
		background: #4f46e5;
		transform: translateY(-2px);
	}
</style>

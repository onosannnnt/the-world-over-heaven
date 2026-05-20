<script>
	import { settings } from '$lib/settings.svelte.js';
	import ReadingPanel from './ReadingPanel.svelte';

	let { data } = $props();
	const cards = data.cards;

	let showReadingPanel = $state(false);

	// State
	let searchQuery = $state('');
	let filterArcana = $state('all'); // 'all', 'major', 'minor'
	let filterSuit = $state('all'); // 'all', 'cups', 'wands', 'swords', 'pentacles'
	let showImages = $state(true);

	let selectedCards = $state([]);

	// Derived state for filtering
	let filteredCards = $derived(
		cards.filter((card) => {
			const matchesSearch =
				searchQuery === '' ||
				card.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
				card.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
				card.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

			const matchesArcana = filterArcana === 'all' || card.arcana === filterArcana;
			const matchesSuit = filterSuit === 'all' || card.suit === filterSuit;

			return matchesSearch && matchesArcana && matchesSuit;
		})
	);

	// Grouping and sorting logic
	const suitOrder = { wands: 1, cups: 2, swords: 3, pentacles: 4 };
	let groupedCards = $derived({
		major: filteredCards
			.filter((c) => c.arcana === 'major')
			.sort((a, b) => {
				if (!showImages) return a.nameTh.localeCompare(b.nameTh, 'th');
				return a.value - b.value;
			}),
		minor: filteredCards
			.filter((c) => c.arcana === 'minor')
			.sort((a, b) => {
				// Sort by Suit first
				const suitA = suitOrder[a.suit] || 99;
				const suitB = suitOrder[b.suit] || 99;
				if (suitA !== suitB) return suitA - suitB;
				// Then by Value
				return a.value - b.value;
			})
	});

	function toggleSelection(card) {
		const index = selectedCards.findIndex((c) => c.id === card.id);
		if (index !== -1) {
			selectedCards = selectedCards.filter((c) => c.id !== card.id);
		} else {
			selectedCards = [...selectedCards, { ...card, isReversed: false }];
		}
	}

	function toggleReversed(cardId) {
		selectedCards = selectedCards.map((c) =>
			c.id === cardId ? { ...c, isReversed: !c.isReversed } : c
		);
	}

	function removeCard(cardId) {
		selectedCards = selectedCards.filter((c) => c.id !== cardId);
	}

	// Reset suit filter when arcana filter changes to something other than 'minor'
	$effect(() => {
		if (filterArcana !== 'minor') {
			filterSuit = 'all';
		}
	});
</script>

<div class="tarot-page">
	<!-- Controls Bar -->
	<div class="controls-bar">
		<div class="search-bar">
			<input type="text" bind:value={searchQuery} placeholder="ค้นหาชื่อไพ่ หรือ keyword..." />
		</div>
		<div class="filters">
			<select bind:value={filterArcana}>
				<option value="all">ทุก Arcana</option>
				<option value="major">Major Arcana</option>
				<option value="minor">Minor Arcana</option>
			</select>
			{#if filterArcana === 'minor'}
				<select bind:value={filterSuit}>
					<option value="all">ทุกชุด (Suits)</option>
					<option value="cups">ถ้วย (Cups)</option>
					<option value="wands">ไม้กายสิทธิ์ (Wands)</option>
					<option value="swords">ดาบ (Swords)</option>
					<option value="pentacles">เหรียญ (Pentacles)</option>
				</select>
			{/if}
			<div class="flex items-center gap-3">
				<span class="text-sm font-medium text-slate-500 dark:text-slate-400">แสดงรูปไพ่</span>
				<button
					class="relative h-6 w-12 rounded-full transition-colors {showImages
						? 'bg-indigo-600'
						: 'bg-slate-300 dark:bg-slate-700'}"
					onclick={() => (showImages = !showImages)}
					title="แสดงรูปไพ่"
				>
					<div
						class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform {showImages
							? 'translate-x-6'
							: ''}"
					></div>
				</button>
			</div>
		</div>
	</div>

	<!-- Main Content with Groups -->
	<main class="content-area">
		{#if filteredCards.length === 0}
			<p class="no-results">ไม่พบไพ่ที่ค้นหา</p>
		{:else}
			<!-- Major Arcana Section -->
			{#if groupedCards.major.length > 0}
				<section class="arcana-section">
					<h2 class="section-title">Major Arcana</h2>
					<div
						class="grid-container"
						class:list-view={!showImages}
						style="gap: {settings.cardSpacing}rem"
					>
						{#each groupedCards.major as card}
							<button
								class="card"
								class:selected={selectedCards.some((c) => c.id === card.id)}
								onclick={() => toggleSelection(card)}
								title={card.nameTh}
							>
								{#if showImages && card.imageUrl}
									<img src={card.imageUrl} alt={card.nameEn} loading="lazy" />
								{:else}
									<div class="card-placeholder">
										<span class="card-name leading-tight font-bold"
											>{card.nameTh.split(' (')[0]}</span
										>
										<span class="card-name-en text-xs opacity-75">{card.nameEn}</span>
									</div>
								{/if}

								{#if settings.showCardNames && showImages}
									<div class="card-tooltip">
										<span class="block leading-tight font-bold">{card.nameTh.split(' (')[0]}</span>
										<span class="mt-0.5 block text-xs opacity-80">{card.nameEn}</span>
									</div>
								{/if}
							</button>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Minor Arcana Section -->
			{#if groupedCards.minor.length > 0}
				<section class="arcana-section">
					<h2 class="section-title">Minor Arcana</h2>
					<div
						class="grid-container"
						class:list-view={!showImages}
						style="gap: {settings.cardSpacing}rem"
					>
						{#each groupedCards.minor as card}
							<button
								class="card"
								class:selected={selectedCards.some((c) => c.id === card.id)}
								onclick={() => toggleSelection(card)}
								title={card.nameTh}
							>
								{#if showImages && card.imageUrl}
									<img src={card.imageUrl} alt={card.nameEn} loading="lazy" />
								{:else}
									<div class="card-placeholder">
										<span class="card-name leading-tight font-bold"
											>{card.nameTh.split(' (')[0]}</span
										>
										<span class="card-name-en text-xs opacity-75">{card.nameEn}</span>
										{#if card.suit}
											<span class="card-suit mt-1 block text-xs">{card.suit}</span>
										{/if}
									</div>
								{/if}

								{#if settings.showCardNames && showImages}
									<div class="card-tooltip">
										<span class="block leading-tight font-bold">{card.nameTh.split(' (')[0]}</span>
										<span class="mt-0.5 block text-xs opacity-80">{card.nameEn}</span>
									</div>
								{/if}
							</button>
						{/each}
					</div>
				</section>
			{/if}
		{/if}
	</main>

	<!-- Selection Dock -->
	{#if selectedCards.length > 0}
		<div class="selection-dock">
			<div class="dock-header">
				<h3>ไพ่ที่เลือก ({selectedCards.length})</h3>
				<div class="dock-actions">
					<button class="btn-clear" onclick={() => (selectedCards = [])}>ลบทั้งหมด</button>
					<button class="btn-read" onclick={() => (showReadingPanel = true)}>อ่านความหมาย</button>
				</div>
			</div>
			<div class="selected-cards-list">
				{#each selectedCards as card}
					<div class="selected-card-item">
						<div class="flex flex-col">
							<span class="name">{card.nameTh.split(' (')[0]}</span>
							<span class="text-xs text-slate-400">{card.nameEn}</span>
						</div>
						<div class="flex items-center gap-3" title="ไพ่กลับหัว">
							<span class="text-xs text-slate-400">↕</span>
							<button
								class="relative h-5 w-10 rounded-full transition-colors {card.isReversed
									? 'bg-indigo-600'
									: 'bg-slate-300 dark:bg-slate-700'}"
								onclick={() => toggleReversed(card.id)}
							>
								<div
									class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform {card.isReversed
										? 'translate-x-5'
										: ''}"
								></div>
							</button>
						</div>
						<button class="btn-remove ml-1" onclick={() => removeCard(card.id)}>✕</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Reading Panel Modal -->
	{#if showReadingPanel}
		<ReadingPanel {selectedCards} user={data.user} onClose={() => (showReadingPanel = false)} />
	{/if}
</div>

<style>
	.tarot-page {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.controls-bar {
		padding: 1.5rem;
		background: white;
		border-bottom: 1px solid #e2e8f0;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	:global(.dark) .controls-bar {
		background: #1e293b;
		border-color: #334155;
	}

	.search-bar input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		font-size: 1rem;
		margin-bottom: 1rem;
		background: #f8fafc;
		transition: all 0.2s;
	}

	:global(.dark) .search-bar input {
		background: #0f172a;
		border-color: #334155;
		color: white;
	}

	.search-bar input:focus {
		outline: none;
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	.filters {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.filters select {
		padding: 0.5rem 1rem;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
		background: white;
		font-size: 0.9rem;
	}

	:global(.dark) .filters select {
		background: #0f172a;
		border-color: #334155;
		color: white;
	}

	.content-area {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
		padding-bottom: 300px;
	}

	.arcana-section {
		margin-bottom: 3rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 800;
		margin-bottom: 1.5rem;
		color: #6366f1;
		border-left: 4px solid currentColor;
		padding-left: 1rem;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	}

	.grid-container.list-view {
		grid-template-columns: repeat(auto-fill, minmax(45%, 1fr));
	}

	@media (max-width: 640px) {
		.grid-container.list-view {
			grid-template-columns: 1fr;
		}
	}

	.card {
		position: relative;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		aspect-ratio: 1 / 1.7; /* Standard tarot card aspect ratio */
		background: #0f172a;
		border: 2px solid transparent;
		overflow: hidden;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		padding: 0;
		text-align: left;
	}

	.list-view .card {
		aspect-ratio: auto;
		height: 60px;
	}

	:global(.dark) .card {
		background: #1e293b;
	}

	.card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
	}

	.card.selected {
		border-color: #6366f1;
		box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
	}

	.card img {
		width: 100%;
		height: 100%;
		object-fit: contain; /* Prevents cropping or squishing */
	}

	.card-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 1rem;
		text-align: center;
		background: #f1f5f9;
		color: #475569;
	}

	.list-view .card-placeholder {
		flex-direction: row;
		justify-content: flex-start;
		gap: 1rem;
		padding: 0 1.5rem;
	}

	:global(.dark) .card-placeholder {
		background: #334155;
		color: #cbd5e1;
	}

	.card-tooltip {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
		color: white;
		padding: 1.5rem 0.5rem 0.5rem;
		font-size: 0.8rem;
		text-align: center;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.card:hover .card-tooltip {
		opacity: 1;
	}

	.selection-dock {
		position: fixed;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		width: calc(100% - 3rem);
		max-width: 800px;
		background: white;
		box-shadow:
			0 -10px 25px rgba(0, 0, 0, 0.1),
			0 20px 25px -5px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		max-height: 300px;
		overflow-y: auto;
		z-index: 40;
		border-radius: 24px;
		border: 1px solid #e2e8f0;
	}

	:global(.dark) .selection-dock {
		background: #1e293b;
		border-color: #334155;
		box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.3);
	}

	.dock-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.dock-header h3 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: bold;
	}

	.dock-actions {
		display: flex;
		gap: 0.75rem;
	}

	.btn-clear {
		background: #f1f5f9;
		color: #475569;
		border: none;
		padding: 0.5rem 1.25rem;
		border-radius: 10px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s;
	}

	:global(.dark) .btn-clear {
		background: #334155;
		color: #cbd5e1;
	}

	.btn-clear:hover {
		background: #fee2e2;
		color: #ef4444;
	}

	.btn-read {
		background: #6366f1;
		color: white;
		border: none;
		padding: 0.5rem 1.5rem;
		border-radius: 10px;
		cursor: pointer;
		font-weight: bold;
		box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);
		transition: all 0.2s;
	}

	.btn-read:hover {
		background: #4f46e5;
		transform: translateY(-1px);
		box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
	}

	.selected-cards-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.5rem;
	}

	.selected-card-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #f8fafc;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		border: 1px solid #e2e8f0;
	}

	:global(.dark) .selected-card-item {
		background: #0f172a;
		border-color: #334155;
	}

	.name {
		font-weight: 600;
		font-size: 0.9rem;
	}

	.reversed-toggle {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		cursor: pointer;
		font-size: 0.8rem;
		color: #64748b;
	}

	.btn-remove {
		background: none;
		border: none;
		color: #94a3b8;
		cursor: pointer;
		font-size: 1.1rem;
		transition: color 0.2s;
	}

	.btn-remove:hover {
		color: #ef4444;
	}

	@media (max-width: 640px) {
		.grid-container {
			grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
			gap: 0.5rem !important;
		}

		.grid-container.list-view {
			grid-template-columns: 1fr;
		}

		.content-area {
			padding: 1rem;
			padding-bottom: 300px;
		}

		.controls-bar {
			padding: 1rem;
		}

		.filters {
			gap: 0.5rem;
		}

		.filters select {
			padding: 0.4rem 0.5rem;
			font-size: 0.8rem;
		}

		.selection-dock {
			width: calc(100% - 1rem);
			bottom: 0.5rem;
			border-radius: 16px;
			padding: 1rem;
		}
	}
</style>

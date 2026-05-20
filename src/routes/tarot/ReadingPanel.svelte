<script>
	let { selectedCards, user, onClose } = $props();

	let activeTab = $state('meanings'); // 'meanings', 'ai'

	// AI State
	let userQuestion = $state('');
	let aiSummary = $state('');
	let isGenerating = $state(false);
	let aiError = $state('');

	/** @typedef {Object} Card
	 * @property {boolean} isReversed
	 * @property {string} meaningGeneral
	 * @property {string} meaningLove
	 * @property {string} meaningCareer
	 * @property {string} meaningFinance
	 * @property {string} revGeneral
	 * @property {string} revLove
	 * @property {string} revCareer
	 * @property {string} revFinance
	 */

	/**
	 * @param {any} card
	 * @param {'general' | 'love' | 'career' | 'finance'} type
	 */
	function getMeaning(card, type) {
		if (card.isReversed) {
			switch (type) {
				case 'general':
					return card.revGeneral;
				case 'love':
					return card.revLove;
				case 'career':
					return card.revCareer;
				case 'finance':
					return card.revFinance;
				default:
					return '';
			}
		} else {
			switch (type) {
				case 'general':
					return card.meaningGeneral;
				case 'love':
					return card.meaningLove;
				case 'career':
					return card.meaningCareer;
				case 'finance':
					return card.meaningFinance;
				default:
					return '';
			}
		}
	}

	async function generateAISummary() {
		isGenerating = true;
		aiError = '';
		aiSummary = ''; // Clear previous if re-generating with a question

		try {
			const response = await fetch('/api/synthesize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					cards: selectedCards,
					question: userQuestion
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to generate summary');
			}

			aiSummary = data.summary;
		} catch (error) {
			aiError = error instanceof Error ? error.message : String(error);
		} finally {
			isGenerating = false;
		}
	}
</script>

<div
	class="modal-backdrop"
	onclick={onClose}
	onkeydown={(e) => e.key === 'Escape' && onClose()}
	role="button"
	tabindex="-1"
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog">
		<header class="modal-header">
			<h2>คำทำนายไพ่ยิปซี</h2>
			<button class="btn-close" onclick={onClose}>✕</button>
		</header>

		<div class="tabs">
			<button
				class="tab-btn"
				class:active={activeTab === 'meanings'}
				onclick={() => (activeTab = 'meanings')}
			>
				ความหมายรายใบ
			</button>
			<button class="tab-btn" class:active={activeTab === 'ai'} onclick={() => (activeTab = 'ai')}>
				ภาพรวม (AI Insight)
			</button>
		</div>

		<div class="modal-body">
			{#if activeTab === 'meanings'}
				<div class="cards-meanings">
					{#each selectedCards as card (card.id)}
						<div class="meaning-card">
							<div class="card-header">
								{#if card.imageUrl}
									<img
										src={card.imageUrl}
										alt={card.nameEn}
										class="card-img"
										class:reversed={card.isReversed}
									/>
								{/if}
								<div class="card-title-info">
									<h3>{card.nameTh}</h3>
									<span class="status-badge" class:reversed={card.isReversed}>
										{card.isReversed ? 'ไพ่กลับหัว (Reversed)' : 'ไพ่ตั้งตรง (Upright)'}
									</span>
								</div>
							</div>

							<div class="meaning-sections">
								<section>
									<h4>🔮 ความหมายทั่วไป</h4>
									<p>{getMeaning(card, 'general') || 'ไม่มีข้อมูล'}</p>
								</section>
								<section>
									<h4>❤️ ความรัก</h4>
									<p>{getMeaning(card, 'love') || 'ไม่มีข้อมูล'}</p>
								</section>
								<section>
									<h4>💼 การงาน</h4>
									<p>{getMeaning(card, 'career') || 'ไม่มีข้อมูล'}</p>
								</section>
								<section>
									<h4>💰 การเงิน</h4>
									<p>{getMeaning(card, 'finance') || 'ไม่มีข้อมูล'}</p>
								</section>
							</div>
						</div>
					{/each}
				</div>
			{:else if activeTab === 'ai'}
				<div class="ai-section">
					{#if !user}
						<div class="auth-required">
							<div class="lock-icon">🔒</div>
							<h3>ฟีเจอร์นี้สำหรับสมาชิกเท่านั้น</h3>
							<p>กรุณาเข้าสู่ระบบเพื่อใช้งานแม่หมอ AI ในการสรุปภาพรวมและวิเคราะห์คำถามของคุณ</p>
							<a href="/login" class="btn-login-prompt">เข้าสู่ระบบ / สมัครสมาชิก</a>
						</div>
					{:else}
						<div class="question-box">
							<label for="question">คุณมีคำถามอะไรเป็นพิเศษไหม? (ระบุหรือไม่ระบุก็ได้)</label>
							<textarea
								id="question"
								bind:value={userQuestion}
								placeholder="เช่น ความรักในช่วงนี้จะเป็นอย่างไร?, งานใหม่ที่สมัครไว้จะได้ไหม?..."
							></textarea>
							<button class="btn-generate" onclick={generateAISummary} disabled={isGenerating}>
								{isGenerating ? 'กำลังประมวลผล...' : aiSummary ? 'คำทำนายใหม่' : 'เริ่มทำนายภาพรวม'}
							</button>
						</div>

						<div class="ai-result">
							{#if isGenerating}
								<div class="loading-state">
									<div class="spinner"></div>
									<p>แม่หมอ AI กำลังผูกดวงชะตาและวิเคราะห์คำตอบ...</p>
								</div>
							{:else if aiError}
								<div class="error-state">
									<p>เกิดข้อผิดพลาด: {aiError}</p>
									<button class="btn-retry" onclick={generateAISummary}>ลองใหม่อีกครั้ง</button>
								</div>
							{:else if aiSummary}
								<div class="markdown-content">
									{#if userQuestion}
										<div class="user-q-display">
											<strong>คำถามของคุณ:</strong>
											{userQuestion}
										</div>
										<hr />
									{/if}
									{#each aiSummary.split('\n') as paragraph, i (i)}
										{#if paragraph.startsWith('##')}
											<h3>{paragraph.replace(/#/g, '').trim()}</h3>
										{:else if paragraph.startsWith('**') && paragraph.endsWith('**')}
											<strong>{paragraph.replace(/\*\*/g, '').trim()}</strong><br />
										{:else if paragraph.startsWith('* ')}
											<li>{paragraph.substring(2)}</li>
										{:else if paragraph.trim()}
											<p>{paragraph.replace(/\*\*/g, '')}</p>
										{/if}
									{/each}
								</div>
							{:else}
								<div class="empty-ai">
									<p>
										กดปุ่ม "เริ่มทำนายภาพรวม" เพื่อให้ AI ช่วยสรุปความหมายของไพ่ทั้งหมดเข้าด้วยกัน
									</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: 1rem;
	}

	.modal-content {
		background: white;
		border-radius: 12px;
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
	}

	:global(.dark) .modal-content {
		background: #1e293b;
		color: white;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #eee;
	}

	:global(.dark) .modal-header {
		border-color: #334155;
	}

	.modal-header h2 {
		margin: 0;
		color: #333;
	}

	:global(.dark) .modal-header h2 {
		color: white;
	}

	.btn-close {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #666;
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid #ddd;
		background: #f8fafc;
	}

	:global(.dark) .tabs {
		background: #0f172a;
		border-color: #334155;
	}

	.tab-btn {
		flex: 1;
		padding: 1rem;
		background: none;
		border: none;
		font-size: 1rem;
		font-weight: bold;
		color: #64748b;
		cursor: pointer;
		border-bottom: 3px solid transparent;
	}

	.tab-btn.active {
		color: #6366f1;
		border-bottom-color: #6366f1;
		background: white;
	}

	:global(.dark) .tab-btn.active {
		background: #1e293b;
		color: #818cf8;
	}

	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.cards-meanings {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.meaning-card {
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.5rem;
		background: #fafafa;
	}

	:global(.dark) .meaning-card {
		background: #334155;
		border-color: #475569;
	}

	.card-header {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
		align-items: center;
	}

	.card-img {
		width: 80px;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.card-img.reversed {
		transform: rotate(180deg);
	}

	.card-title-info h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: bold;
		background: #dcfce7;
		color: #166534;
	}

	.status-badge.reversed {
		background: #fee2e2;
		color: #991b1b;
	}

	.meaning-sections {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 600px) {
		.meaning-sections {
			grid-template-columns: 1fr 1fr;
		}
	}

	.meaning-sections section {
		background: white;
		padding: 1rem;
		border-radius: 6px;
		border: 1px solid #eee;
	}

	:global(.dark) .meaning-sections section {
		background: #1e293b;
		border-color: #475569;
	}

	.meaning-sections h4 {
		margin: 0 0 0.5rem 0;
		color: #475569;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	:global(.dark) .meaning-sections h4 {
		color: #94a3b8;
	}

	.meaning-sections p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: #334155;
	}

	:global(.dark) .meaning-sections p {
		color: #cbd5e1;
	}

	.ai-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.question-box {
		background: #f1f5f9;
		padding: 1.5rem;
		border-radius: 12px;
		border: 1px solid #e2e8f0;
	}

	:global(.dark) .question-box {
		background: #0f172a;
		border-color: #334155;
	}

	.question-box label {
		display: block;
		margin-bottom: 0.75rem;
		font-weight: 600;
		font-size: 0.9rem;
		color: #475569;
	}

	:global(.dark) .question-box label {
		color: #94a3b8;
	}

	.question-box textarea {
		width: 100%;
		height: 80px;
		padding: 0.75rem;
		border-radius: 8px;
		border: 1px solid #cbd5e1;
		margin-bottom: 1rem;
		font-family: inherit;
		resize: none;
	}

	:global(.dark) .question-box textarea {
		background: #1e293b;
		border-color: #475569;
		color: white;
	}

	.btn-generate {
		width: 100%;
		padding: 0.75rem;
		background: #6366f1;
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-generate:hover:not(:disabled) {
		background: #4f46e5;
	}

	.btn-generate:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.ai-result {
		min-height: 100px;
	}

	.user-q-display {
		background: #e0e7ff;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		color: #3730a3;
		font-size: 0.95rem;
	}

	:global(.dark) .user-q-display {
		background: #312e81;
		color: #c7d2fe;
	}

	.markdown-content {
		line-height: 1.6;
		color: #334155;
	}

	:global(.dark) .markdown-content {
		color: #cbd5e1;
	}

	.markdown-content h3 {
		color: #1e293b;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	:global(.dark) .markdown-content h3 {
		color: white;
	}

	.markdown-content li {
		margin-left: 1.5rem;
		margin-bottom: 0.25rem;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 0;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #e2e8f0;
		border-top: 4px solid #6366f1;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.empty-ai {
		text-align: center;
		padding: 3rem 0;
		color: #64748b;
		border: 2px dashed #e2e8f0;
		border-radius: 12px;
	}

	.auth-required {
		text-align: center;
		padding: 4rem 2rem;
		background: #f8fafc;
		border-radius: 16px;
		border: 1px dashed #cbd5e1;
	}

	:global(.dark) .auth-required {
		background: #0f172a;
		border-color: #334155;
	}

	.lock-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.auth-required h3 {
		margin: 0 0 0.5rem 0;
		color: #1e293b;
		font-size: 1.25rem;
	}

	:global(.dark) .auth-required h3 {
		color: white;
	}

	.auth-required p {
		color: #64748b;
		margin-bottom: 2rem;
	}

	:global(.dark) .auth-required p {
		color: #94a3b8;
	}

	.btn-login-prompt {
		display: inline-block;
		background: #6366f1;
		color: white;
		text-decoration: none;
		padding: 0.75rem 2rem;
		border-radius: 8px;
		font-weight: bold;
		transition: background 0.2s;
	}

	.btn-login-prompt:hover {
		background: #4f46e5;
	}
</style>

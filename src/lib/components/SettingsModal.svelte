<script>
	import { settings } from '$lib/settings.svelte.js';
	let { isOpen, onClose } = $props();
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
		onclick={onClose}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
		role="button"
		tabindex="-1"
		aria-label="Close modal"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div
				class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800"
			>
				<h2 class="text-xl font-bold text-slate-900 dark:text-white">การตั้งค่า UX/UI</h2>
				<button
					class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
					onclick={onClose}
					aria-label="Close"
				>
					✕
				</button>
			</div>

			<div class="space-y-6 p-6">
				<!-- Theme -->
				<div class="space-y-2">
					<span class="text-sm font-medium text-slate-500 dark:text-slate-300">โหมดการแสดงผล</span>
					<div class="grid grid-cols-2 gap-2">
						<button
							class="rounded-lg border px-4 py-2 transition-all {settings.theme === 'light'
								? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
								: 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white'}"
							onclick={() => (settings.theme = 'light')}
						>
							☀️ สว่าง
						</button>
						<button
							class="rounded-lg border px-4 py-2 transition-all {settings.theme === 'dark'
								? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
								: 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white'}"
							onclick={() => (settings.theme = 'dark')}
						>
							🌙 มืด
						</button>
					</div>
				</div>

				<!-- Font Size -->
				<div class="space-y-2">
					<div class="flex justify-between">
						<label
							for="font-size-range"
							class="text-sm font-medium text-slate-500 dark:text-slate-300">ขนาดตัวอักษร</label
						>
						<span class="text-sm font-bold text-slate-900 dark:text-white"
							>{settings.fontSize}px</span
						>
					</div>
					<input
						id="font-size-range"
						type="range"
						min="12"
						max="24"
						step="1"
						bind:value={settings.fontSize}
						class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-500 dark:bg-slate-700"
					/>
				</div>

				<!-- Card Spacing -->
				<div class="space-y-2">
					<div class="flex justify-between">
						<label
							for="card-spacing-range"
							class="text-sm font-medium text-slate-500 dark:text-slate-300">ระยะห่างของไพ่</label
						>
						<span class="text-sm font-bold text-slate-900 dark:text-white"
							>{settings.cardSpacing}x</span
						>
					</div>
					<input
						id="card-spacing-range"
						type="range"
						min="0.5"
						max="2"
						step="0.1"
						bind:value={settings.cardSpacing}
						class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-500 dark:bg-slate-700"
					/>
				</div>

				<!-- Toggle Names -->
				<div class="flex items-center justify-between">
					<span
						id="show-card-names-label"
						class="text-sm font-medium text-slate-500 dark:text-slate-300">แสดงชื่อไพ่บนรูป</span
					>
					<button
						class="relative h-6 w-12 rounded-full transition-colors {settings.showCardNames
							? 'bg-indigo-600'
							: 'bg-slate-300 dark:bg-slate-700'}"
						onclick={() => (settings.showCardNames = !settings.showCardNames)}
						aria-labelledby="show-card-names-label"
					>
						<div
							class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform {settings.showCardNames
								? 'translate-x-6'
								: ''}"
						></div>
					</button>
				</div>
			</div>

			<div class="flex justify-end bg-slate-50 px-6 py-4 dark:bg-slate-800/50">
				<button
					class="rounded-lg bg-indigo-600 px-6 py-2 font-bold text-white transition-all hover:bg-indigo-500"
					onclick={onClose}
				>
					ตกลง
				</button>
			</div>
		</div>
	</div>
{/if}

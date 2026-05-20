<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { settings } from '$lib/settings.svelte.js';
	import SettingsModal from '$lib/components/SettingsModal.svelte';

	let { children, data } = $props();
	let isSettingsOpen = $state(false);

	const user = $derived(data?.user);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200"
>
	<!-- Global Navbar -->
	<nav
		class="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-[#0f172a]/70"
	>
		<!-- Left: Logo -->
		<a href="/" class="group flex items-center gap-2 no-underline">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110"
			>
				<span class="font-bold text-white">T</span>
			</div>
			<span
				class="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-slate-400"
			>
				The World Over Heaven
			</span>
		</a>

		<!-- Right: Navigation & Settings -->
		<div class="flex items-center gap-6 text-sm font-medium">
			<a
				href="/tarot"
				class="text-slate-500 no-underline transition-colors hover:text-indigo-500 dark:text-slate-400 dark:hover:text-white"
			>
				เริ่มทำนาย
			</a>
			<a
				href="/tarot/history"
				class="text-slate-500 no-underline transition-colors hover:text-indigo-500 dark:text-slate-400 dark:hover:text-white"
			>
				ประวัติ
			</a>

			{#if user}
				<div class="flex items-center gap-4 border-l border-slate-200 pl-6 dark:border-slate-800">
					<span class="hidden text-xs text-slate-400 md:inline">สวัสดี, {user.name}</span>
					<form method="POST" action="/login?/signOut">
						<button
							type="submit"
							class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold transition-all hover:bg-red-500 hover:text-white dark:bg-slate-800"
						>
							ออกจากระบบ
						</button>
					</form>
				</div>
			{:else}
				<a
					href="/login"
					class="rounded-lg bg-indigo-600 px-4 py-2 text-white no-underline shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500"
				>
					เข้าสู่ระบบ
				</a>
			{/if}

			<button
				class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-all hover:bg-indigo-500 hover:text-white dark:bg-slate-800 dark:text-slate-300"
				onclick={() => (isSettingsOpen = true)}
				title="ตั้งค่า"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</nav>

	<!-- Content Area -->
	<main style="--card-spacing: {settings.cardSpacing}rem">
		{@render children()}
	</main>

	<!-- Settings Modal -->
	<SettingsModal isOpen={isSettingsOpen} onClose={() => (isSettingsOpen = false)} />
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Sarabun', sans-serif;
		overflow-x: hidden;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	main {
		min-height: calc(100vh - 73px);
	}
</style>

<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let visible = $state(false);

	onMount(() => {
		visible = true;
	});
</script>

<!-- Hero Section -->
<section class="relative flex flex-col items-center overflow-hidden px-6 pt-20 pb-32 text-center">
	<!-- Background Glows -->
	<div
		class="absolute top-0 left-1/2 -z-10 h-[500px] w-full -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px] dark:bg-indigo-600/10"
	></div>
	<div
		class="absolute -top-24 -left-24 -z-10 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px]"
	></div>

	{#if visible}
		<div in:fly={{ y: 20, duration: 800 }}>
			<h1 class="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
				<span
					class="bg-gradient-to-b from-slate-900 to-slate-500 bg-clip-text text-transparent dark:from-white dark:to-slate-500"
				>
					ไขปริศนาแห่งโชคชะตา
				</span>
				<br />
				<span class="text-indigo-600 dark:text-indigo-400">ด้วยพลังของ AI</span>
			</h1>
			<p
				class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-400"
			>
				ก้าวเข้าสู่โลกแห่งความลึกลับของไพ่ยิปซี ผสมผสานศาสตร์แห่งการพยากรณ์ดั้งเดิม เข้ากับเทคโนโลยี
				AI อันล้ำสมัย เพื่อคำทำนายที่แม่นยำและลึกซึ้งยิ่งกว่าเดิม
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/tarot"
					class="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 hover:bg-indigo-500"
				>
					เริ่มทำนายดวงของคุณ
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
				<a
					href="/tarot/history"
					class="flex items-center justify-center rounded-full bg-slate-200 px-8 py-4 font-bold text-slate-900 transition-all hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
				>
					ดูประวัติย้อนหลัง
				</a>
			</div>
		</div>
	{/if}

	<!-- Floating Cards Decoration -->
	<div class="mt-20 flex justify-center gap-4 opacity-40">
		<div
			class="h-40 w-24 -rotate-12 animate-pulse rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900/50"
		></div>
		<div
			class="-mt-8 h-40 w-24 rounded-lg border border-indigo-500/50 bg-indigo-500/10 shadow-2xl shadow-indigo-500/20"
		></div>
		<div
			class="h-40 w-24 rotate-12 animate-pulse rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900/50"
			style="animation-delay: 1s"
		></div>
	</div>
</section>

<!-- Features Section -->
<section
	id="features"
	class="border-y border-slate-200 bg-white/50 px-6 py-24 dark:border-slate-800 dark:bg-slate-900/50"
>
	<div class="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
		<div class="flex flex-col items-center p-6 text-center">
			<div
				class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
			</div>
			<h3 class="mb-3 text-xl font-bold">แม่หมอ AI (AI Insight)</h3>
			<p class="text-slate-600 dark:text-slate-400">
				ประมวลผลความหมายของไพ่หลายใบเข้าด้วยกันเป็นเนื้อเรื่องเดียวอย่างเป็นธรรมชาติ
			</p>
		</div>

		<div class="flex flex-col items-center p-6 text-center">
			<div
				class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.586 0.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332 0.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332 0.477-4.5 1.253"
					/>
				</svg>
			</div>
			<h3 class="mb-3 text-xl font-bold">คลังข้อมูลไพ่ที่ครบถ้วน</h3>
			<p class="text-slate-600 dark:text-slate-400">
				รวบรวมความหมายทั้งด้านทั่วไป ความรัก การงาน และการเงิน รวมถึงไพ่กลับหัว
			</p>
		</div>

		<div class="flex flex-col items-center p-6 text-center">
			<div
				class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<h3 class="mb-3 text-xl font-bold">บันทึกประวัติการทำนาย</h3>
			<p class="text-slate-600 dark:text-slate-400">
				เก็บประวัติการเปิดไพ่ 20 ครั้งล่าสุดไว้ในเบราว์เซอร์ของคุณเพื่อย้อนกลับมาอ่านได้เสมอ
			</p>
		</div>
	</div>
</section>

<!-- Footer -->
<footer
	class="border-t border-slate-200 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-800"
>
	<p>&copy; 2026 The World Over Heaven. Created with Mystical Power and AI.</p>
</footer>

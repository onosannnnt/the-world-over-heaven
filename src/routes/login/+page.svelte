<script>
	let { form } = $props();
	let mode = $state('signIn'); // 'signIn' or 'signUp'
</script>

<div class="auth-page flex min-h-screen items-center justify-center p-6">
	<div class="auth-card w-full max-w-[400px]">
		<!-- Logo / Branding -->
		<div class="mb-10 text-center">
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20"
			>
				<span class="text-2xl font-extrabold text-white">T</span>
			</div>
			<h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
				The World Over Heaven
			</h1>
			<p class="text-slate-500 dark:text-slate-400">
				{mode === 'signIn' ? 'ยินดีต้อนรับกลับมา' : 'เริ่มต้นการเดินทางของคุณ'}
			</p>
		</div>

		<!-- Main Card -->
		<div
			class="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900"
		>
			<!-- Tab Switcher -->
			<div class="mb-8 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
				<button
					class="flex-1 rounded-lg py-2 text-sm font-bold transition-all {mode === 'signIn'
						? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
						: 'text-slate-500 dark:text-slate-400'}"
					onclick={() => (mode = 'signIn')}
				>
					เข้าสู่ระบบ
				</button>
				<button
					class="flex-1 rounded-lg py-2 text-sm font-bold transition-all {mode === 'signUp'
						? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
						: 'text-slate-500 dark:text-slate-400'}"
					onclick={() => (mode = 'signUp')}
				>
					สมัครสมาชิก
				</button>
			</div>

			{#if mode === 'signIn'}
				<!-- Sign In Form -->
				<form method="POST" action="?/signIn" class="space-y-4">
					<div class="space-y-2">
						<label
							for="login-email"
							class="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
							>อีเมล</label
						>
						<input
							type="email"
							id="login-email"
							name="email"
							placeholder="you@example.com"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
							required
						/>
					</div>
					<div class="space-y-2">
						<label
							for="login-password"
							class="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
							>รหัสผ่าน</label
						>
						<input
							type="password"
							id="login-password"
							name="password"
							placeholder="••••••••"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
							required
						/>
					</div>
					<button
						type="submit"
						class="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
					>
						เข้าสู่ระบบ
					</button>
				</form>
			{:else}
				<!-- Sign Up Form -->
				<form method="POST" action="?/signUp" class="space-y-4">
					<div class="space-y-2">
						<label
							for="name"
							class="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
							>ชื่อของคุณ</label
						>
						<input
							type="text"
							id="name"
							name="name"
							placeholder="ชื่อนามสกุล"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
							required
						/>
					</div>
					<div class="space-y-2">
						<label
							for="email"
							class="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
							>อีเมล</label
						>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="you@example.com"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
							required
						/>
					</div>
					<div class="space-y-2">
						<label
							for="password"
							class="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
							>รหัสผ่าน</label
						>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="สร้างรหัสผ่านของคุณ"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
							required
						/>
					</div>
					<button
						type="submit"
						class="w-full rounded-xl bg-purple-600 py-3 font-bold text-white transition-all hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.98]"
					>
						สมัครสมาชิก
					</button>
				</form>
			{/if}

			<!-- Status Message -->
			{#if form?.message}
				<div
					class="mt-6 rounded-xl border p-4 text-center text-sm font-medium {form.success
						? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400'
						: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400'}"
				>
					{form.message}
				</div>
			{/if}
		</div>

		<!-- Back Link -->
		<div class="mt-8 text-center">
			<a
				href="/"
				class="text-sm font-medium text-slate-500 no-underline transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
			>
				← กลับไปหน้าหลัก
			</a>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #f8fafc;
	}
	:global(.dark body) {
		background-color: #0f172a;
	}

	.auth-page {
		font-family: 'Sarabun', sans-serif;
	}
</style>

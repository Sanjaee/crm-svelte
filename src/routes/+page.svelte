<script lang="ts">
	import type { PageData } from './$types';
	import {
		Building2,
		Receipt,
		CreditCard,
		CheckCircle2,
		AlertCircle,
		Database,
		ExternalLink,
		Server,
		ShieldCheck,
		Layers
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>WahanaTravel CRM & Back Office</title>
</svelte:head>

<div class="min-h-screen bg-[#101114] text-white">
	<!-- Top Navigation Bar -->
	<header class="border-b border-zinc-800 bg-[#18191D] px-6 py-4 sticky top-0 z-50">
		<div class="max-w-7xl mx-auto flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="h-9 w-9 rounded-lg bg-[#EF233C] flex items-center justify-center font-black text-white text-lg tracking-wider shadow-lg shadow-red-500/20">
					W
				</div>
				<div>
					<h1 class="text-base font-bold tracking-tight text-white flex items-center gap-2">
						WahanaTravel
						<span class="text-xs font-semibold px-2 py-0.5 rounded bg-[#EF233C]/20 text-[#EF233C] border border-[#EF233C]/30">CRM & Back Office</span>
					</h1>
					<p class="text-xs text-zinc-400">Enterprise Travel Management System</p>
				</div>
			</div>

			<div class="flex items-center gap-4">
				{#if data.databaseConnected}
					<div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
						<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
						Neon PostgreSQL Connected
					</div>
				{:else}
					<div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
						<AlertCircle class="w-3.5 h-3.5" />
						Database Disconnected
					</div>
				{/if}

				<a
					href="https://github.com/Sanjaee/crm-svelte"
					target="_blank"
					rel="noreferrer"
					class="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1.5 bg-[#1F2025] px-3 py-1.5 rounded-md border border-zinc-700/60"
				>
					GitHub
					<ExternalLink class="w-3.5 h-3.5" />
				</a>
			</div>
		</div>
	</header>

	<!-- Main Content Area -->
	<main class="max-w-7xl mx-auto px-6 py-8 space-y-8">
		<!-- Connection Status Banner -->
		{#if data.databaseConnected}
			<div class="bg-[#18191D] border border-emerald-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
				<div class="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
				<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div class="flex items-start gap-4">
						<div class="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
							<CheckCircle2 class="w-6 h-6" />
						</div>
						<div>
							<div class="flex items-center gap-2">
								<h2 class="text-lg font-bold text-white">Database Connected & Verified</h2>
								<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300">Live Status: OK</span>
							</div>
							<p class="text-sm text-zinc-400 mt-1">
								Endpoint: <code class="text-xs bg-black/40 px-2 py-0.5 rounded text-zinc-300 font-mono">{data.dbHost}</code>
							</p>
							<p class="text-xs text-zinc-500 mt-1">
								Region: <strong class="text-zinc-400">{data.region}</strong> • Total Active Tables: <strong class="text-emerald-400">{data.tablesCount} tables</strong>
							</p>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<div class="text-right">
							<span class="text-xs text-zinc-400 block">Drizzle ORM Engine</span>
							<span class="text-xs font-semibold text-zinc-200">24 REA Schema Entities</span>
						</div>
						<div class="p-2.5 rounded-lg bg-[#1F2025] border border-zinc-700 text-zinc-300">
							<Database class="w-5 h-5 text-[#EF233C]" />
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="bg-rose-950/20 border border-rose-500/30 rounded-xl p-6">
				<div class="flex items-start gap-4">
					<div class="p-3 rounded-lg bg-rose-500/10 text-rose-400">
						<AlertCircle class="w-6 h-6" />
					</div>
					<div>
						<h2 class="text-lg font-bold text-rose-300">Database Connection Failed</h2>
						<p class="text-sm text-rose-200/80 mt-1">{data.errorMessage}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Metric KPI Cards -->
		<div>
			<h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
				<Layers class="w-4 h-4 text-[#EF233C]" />
				Operational Metrics (Live from DB)
			</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-5">
				<div class="bg-[#1F2025] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition">
					<div class="flex items-center justify-between mb-3">
						<span class="text-xs font-semibold text-zinc-400 uppercase tracking-wide">B2B Customers</span>
						<div class="p-2 rounded-lg bg-[#EF233C]/10 text-[#EF233C]">
							<Building2 class="w-5 h-5" />
						</div>
					</div>
					<div class="text-3xl font-extrabold text-white">{data.stats?.customers ?? 0}</div>
					<p class="text-xs text-zinc-500 mt-2">Active corporate, agent & MOU profiles</p>
				</div>

				<div class="bg-[#1F2025] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition">
					<div class="flex items-center justify-between mb-3">
						<span class="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Invoices</span>
						<div class="p-2 rounded-lg bg-[#EF233C]/10 text-[#EF233C]">
							<Receipt class="w-5 h-5" />
						</div>
					</div>
					<div class="text-3xl font-extrabold text-white">{data.stats?.invoices ?? 0}</div>
					<p class="text-xs text-zinc-500 mt-2">Draft, Submitted, Confirmed & Overdue</p>
				</div>

				<div class="bg-[#1F2025] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition">
					<div class="flex items-center justify-between mb-3">
						<span class="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Payments</span>
						<div class="p-2 rounded-lg bg-[#EF233C]/10 text-[#EF233C]">
							<CreditCard class="w-5 h-5" />
						</div>
					</div>
					<div class="text-3xl font-extrabold text-white">{data.stats?.payments ?? 0}</div>
					<p class="text-xs text-zinc-500 mt-2">Receipts and invoice allocations</p>
				</div>
			</div>
		</div>

		<!-- Reverse Engineered Schema Database Table Registry -->
		<div class="bg-[#18191D] border border-zinc-800 rounded-xl p-6">
			<div class="flex items-center justify-between mb-5">
				<div>
					<h3 class="text-base font-bold text-white flex items-center gap-2">
						<ShieldCheck class="w-5 h-5 text-[#EF233C]" />
						24 Source Tables Reverse-Engineered in Neon PostgreSQL
					</h3>
					<p class="text-xs text-zinc-400 mt-1">
						Sesuai diagram DB WahanaTravel, setiap entitas dan tabel staging rekonsiliasi telah terpasang.
					</p>
				</div>
				<span class="text-xs font-mono bg-zinc-800 text-zinc-300 px-3 py-1 rounded-md border border-zinc-700">
					{data.tables?.length || 0} Tables Active
				</span>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{#each data.tables || [] as table}
					<div class="flex items-center justify-between p-3 rounded-lg bg-[#1F2025] border border-zinc-800/80 text-xs">
						<span class="font-mono text-zinc-300">{table}</span>
						<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
							Ready
						</span>
					</div>
				{/each}
			</div>
		</div>
	</main>
</div>

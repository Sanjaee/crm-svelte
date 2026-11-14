<script lang="ts">
	import { TrendingUp, TrendingDown } from 'lucide-svelte';
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4 lg:px-6">
	<!-- Card 1 -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition">
		<div>
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-zinc-400">Total Revenue</span>
				<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
					<TrendingUp class="w-3 h-3" />
					+12.5%
				</span>
			</div>
			<div class="text-2xl lg:text-3xl font-bold tracking-tight text-white mt-2 tabular-nums">
				$1,250.00
			</div>
		</div>
		<div class="pt-4 mt-2 border-t border-[#27272a]/60">
			<div class="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
				Trending up this month <TrendingUp class="w-3.5 h-3.5 text-emerald-400" />
			</div>
			<p class="text-[11px] text-zinc-500 mt-0.5">Visitors for the last 6 months</p>
		</div>
	</div>

	<!-- Card 2 -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition">
		<div>
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-zinc-400">New Customers</span>
				<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
					<TrendingDown class="w-3 h-3" />
					-20%
				</span>
			</div>
			<div class="text-2xl lg:text-3xl font-bold tracking-tight text-white mt-2 tabular-nums">
				1,234
			</div>
		</div>
		<div class="pt-4 mt-2 border-t border-[#27272a]/60">
			<div class="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
				Down 20% this period <TrendingDown class="w-3.5 h-3.5 text-rose-400" />
			</div>
			<p class="text-[11px] text-zinc-500 mt-0.5">Acquisition needs attention</p>
		</div>
	</div>

	<!-- Card 3 -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition">
		<div>
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-zinc-400">Active Accounts</span>
				<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
					<TrendingUp class="w-3 h-3" />
					+12.5%
				</span>
			</div>
			<div class="text-2xl lg:text-3xl font-bold tracking-tight text-white mt-2 tabular-nums">
				45,678
			</div>
		</div>
		<div class="pt-4 mt-2 border-t border-[#27272a]/60">
			<div class="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
				Strong user retention <TrendingUp class="w-3.5 h-3.5 text-emerald-400" />
			</div>
			<p class="text-[11px] text-zinc-500 mt-0.5">Engagement exceed targets</p>
		</div>
	</div>

	<!-- Card 4 -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition">
		<div>
			<div class="flex items-center justify-between">
				<span class="text-xs font-medium text-zinc-400">Growth Rate</span>
				<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
					<TrendingUp class="w-3 h-3" />
					+4.5%
				</span>
			</div>
			<div class="text-2xl lg:text-3xl font-bold tracking-tight text-white mt-2 tabular-nums">
				4.5%
			</div>
		</div>
		<div class="pt-4 mt-2 border-t border-[#27272a]/60">
			<div class="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
				Steady performance increase <TrendingUp class="w-3.5 h-3.5 text-emerald-400" />
			</div>
			<p class="text-[11px] text-zinc-500 mt-0.5">Meets growth projections</p>
		</div>
	</div>
</div>


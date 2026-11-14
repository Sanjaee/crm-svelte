<script lang="ts">
	import {
		FileText,
		Calendar,
		Download,
		Printer,
		DollarSign,
		CheckCircle2,
		AlertCircle
	} from 'lucide-svelte';

	interface Props {
		summaryData?: any;
	}

	let { summaryData = {} }: Props = $props();

	let selectedDate = $state('2026-11-14');

	function formatCurrency(val: any) {
		const num = Number(val || 0);
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
	}
</script>

<div class="space-y-6">
	<!-- Module Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
		<div>
			<div class="flex items-center gap-2">
				<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EF233C]/10 text-[#EF233C] border border-[#EF233C]/30">
					Module I &bull; Reporting
				</span>
				<span class="text-xs text-zinc-400">Daily Cash & Bank Settlement Audit</span>
			</div>
			<h2 class="text-2xl font-bold tracking-tight text-white mt-1">Daily Payment Report</h2>
			<p class="text-xs text-zinc-400 mt-0.5">
				Laporan harian arus kas masuk, rekonsiliasi penerimaan, dan status penyelesaian piutang operasional WahanaTravel.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<button class="flex items-center gap-2 bg-[#18191D] hover:bg-[#1F2025] border border-[#27272a] text-zinc-300 text-xs font-semibold px-3 py-2 rounded-lg transition">
				<Printer class="w-4 h-4" />
				<span>Print PDF</span>
			</button>
			<button class="flex items-center gap-2 bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm">
				<Download class="w-4 h-4" />
				<span>Export to Excel</span>
			</button>
		</div>
	</div>

	<!-- Date Picker & Filter -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<Calendar class="w-4 h-4 text-[#EF233C]" />
			<span class="text-xs font-bold text-zinc-300">Tanggal Laporan:</span>
			<input
				type="date"
				bind:value={selectedDate}
				class="bg-[#101114] border border-[#27272a] rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#EF233C]"
			/>
		</div>
		<span class="text-xs text-zinc-400 font-mono">Status Rekonsiliasi: ALL BALANCED</span>
	</div>

	<!-- Daily Summary Financial KPI Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Total Dana Diterima</span>
			<p class="text-xl font-bold font-mono text-white mt-1">{formatCurrency(50000000)}</p>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Teralokasi ke Invoice</span>
			<p class="text-xl font-bold font-mono text-emerald-400 mt-1">{formatCurrency(9424000)}</p>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Sisa Unallocated</span>
			<p class="text-xl font-bold font-mono text-amber-400 mt-1">{formatCurrency(40576000)}</p>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Invoice Selesai Lunas</span>
			<p class="text-xl font-bold font-mono text-blue-400 mt-1">1 Invoice</p>
		</div>
	</div>

	<!-- Report Breakdown Table -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl overflow-hidden shadow-lg">
		<div class="p-4 border-b border-[#27272a] bg-[#1F2025]/50 flex items-center justify-between">
			<span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Rincian Transaksi Harian ({selectedDate})</span>
			<span class="text-xs font-mono text-zinc-400">Neon PostgreSQL Real-time Aggregation</span>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-[#101114] text-zinc-400 border-b border-[#27272a] uppercase font-semibold">
					<tr>
						<th class="p-3.5">Payment No</th>
						<th class="p-3.5">Bank Penampung</th>
						<th class="p-3.5">Invoice Terkait</th>
						<th class="p-3.5">Customer</th>
						<th class="p-3.5 text-right">Dana Masuk</th>
						<th class="p-3.5 text-right">Teralokasi</th>
						<th class="p-3.5 text-center">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#27272a]">
					<tr class="hover:bg-[#1F2025]/50 transition">
						<td class="p-3.5 font-mono font-bold text-white">PAY/2026/11/0088</td>
						<td class="p-3.5 text-zinc-300">Bank Mandiri (123-00-1122334)</td>
						<td class="p-3.5 font-mono text-emerald-400">INV/2026/11/0002</td>
						<td class="p-3.5 text-zinc-200">PT Astra International Tbk</td>
						<td class="p-3.5 text-right font-mono font-bold text-white">{formatCurrency(50000000)}</td>
						<td class="p-3.5 text-right font-mono text-emerald-400 font-bold">{formatCurrency(9424000)}</td>
						<td class="p-3.5 text-center">
							<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
								PARTIAL_ALLOCATED
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>


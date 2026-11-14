<script lang="ts">
	import {
		FileSpreadsheet,
		UploadCloud,
		CheckCircle2,
		AlertTriangle,
		RefreshCw,
		FileWarning,
		Search,
		ArrowRight
	} from 'lucide-svelte';

	interface Props {
		items?: any[];
	}

	let { items = [] }: Props = $props();

	let filterStatus = $state('ALL');
	let isProcessing = $state(false);

	const mockVendorRows = [
		{
			id: '1',
			pnrCode: 'WT-GA901',
			invoiceNo: 'INV/2026/11/0001',
			amount: 14025000,
			vendor: 'Garuda Indonesia',
			status: 'MATCHED',
			message: 'PNR dan Nominal cocok dengan tagihan invoice operasional'
		},
		{
			id: '2',
			pnrCode: 'GA-MISSING',
			invoiceNo: 'UNKNOWN',
			amount: 5200000,
			vendor: 'Garuda Indonesia',
			status: 'ERROR',
			message: 'PNR tidak ditemukan dalam sistem WahanaTravel (Staging Error)'
		},
		{
			id: '3',
			pnrCode: 'WT-LION44',
			invoiceNo: 'INV/2026/10/0089',
			amount: 3450000,
			vendor: 'Lion Air',
			status: 'MATCHED',
			message: 'Cocok dengan flight itinerary segmen 1'
		}
	];

	let displayedRows = $derived(
		filterStatus === 'ALL'
			? mockVendorRows
			: mockVendorRows.filter((r) => r.status === filterStatus)
	);

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
					Module F &bull; Flow H
				</span>
				<span class="text-xs text-zinc-400">Vendor Billing Handling & Discrepancy Matching</span>
			</div>
			<h2 class="text-2xl font-bold tracking-tight text-white mt-1">Vendor Billing Reconciliation</h2>
			<p class="text-xs text-zinc-400 mt-0.5">
				Upload file tagihan maskapai/vendor (Excel/CSV), pencocokan PNR otomatis, validasi selisih tarif, dan koreksi error staging.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<label class="flex items-center gap-2 bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm cursor-pointer">
				<UploadCloud class="w-4 h-4" />
				<span>Upload Billing (CSV / Excel)</span>
				<input type="file" accept=".csv, .xlsx, .xls" class="hidden" />
			</label>
		</div>
	</div>

	<!-- Staging Status Summary -->
	<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Total Rows Processed</span>
			<p class="text-xl font-bold font-mono text-white mt-1">1,240</p>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Matched Successfully</span>
			<p class="text-xl font-bold font-mono text-emerald-400 mt-1">1,215</p>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Staging Errors / Mismatch</span>
			<p class="text-xl font-bold font-mono text-red-400 mt-1">25</p>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Total Billed Amount</span>
			<p class="text-xl font-bold font-mono text-zinc-200 mt-1">{formatCurrency(485000000)}</p>
		</div>
	</div>

	<!-- Staging Rows Table -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl overflow-hidden shadow-lg">
		<div class="p-4 border-b border-[#27272a] flex flex-wrap items-center justify-between gap-4 bg-[#1F2025]/50">
			<div class="flex items-center gap-2">
				<button
					onclick={() => (filterStatus = 'ALL')}
					class="px-3 py-1.5 rounded-lg text-xs font-semibold transition {filterStatus === 'ALL'
						? 'bg-[#EF233C] text-white'
						: 'bg-[#101114] text-zinc-400 hover:text-white'}"
				>
					All Records
				</button>
				<button
					onclick={() => (filterStatus = 'MATCHED')}
					class="px-3 py-1.5 rounded-lg text-xs font-semibold transition {filterStatus === 'MATCHED'
						? 'bg-emerald-600 text-white'
						: 'bg-[#101114] text-zinc-400 hover:text-white'}"
				>
					Matched
				</button>
				<button
					onclick={() => (filterStatus = 'ERROR')}
					class="px-3 py-1.5 rounded-lg text-xs font-semibold transition {filterStatus === 'ERROR'
						? 'bg-red-600 text-white'
						: 'bg-[#101114] text-zinc-400 hover:text-white'}"
				>
					Errors / Unmatched
				</button>
			</div>

			<button class="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition">
				<RefreshCw class="w-3.5 h-3.5" />
				<span>Reprocess Staging</span>
			</button>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-[#101114] text-zinc-400 border-b border-[#27272a] uppercase font-semibold">
					<tr>
						<th class="p-3.5">PNR Code</th>
						<th class="p-3.5">Invoice No</th>
						<th class="p-3.5">Vendor</th>
						<th class="p-3.5 text-right">Billed Amount</th>
						<th class="p-3.5 text-center">Status</th>
						<th class="p-3.5">Reconciliation Log & Message</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#27272a]">
					{#each displayedRows as row}
						<tr class="hover:bg-[#1F2025]/50 transition">
							<td class="p-3.5 font-mono font-bold text-white">{row.pnrCode}</td>
							<td class="p-3.5 font-mono text-zinc-300">{row.invoiceNo}</td>
							<td class="p-3.5 text-zinc-300">{row.vendor}</td>
							<td class="p-3.5 text-right font-mono font-bold text-white">{formatCurrency(row.amount)}</td>
							<td class="p-3.5 text-center">
								<span
									class="px-2 py-0.5 rounded text-[10px] font-bold font-mono {row.status === 'MATCHED'
										? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
										: 'bg-red-500/10 text-red-400 border border-red-500/20'}"
								>
									{row.status}
								</span>
							</td>
							<td class="p-3.5 text-zinc-400">{row.message}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>


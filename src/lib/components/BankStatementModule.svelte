<script lang="ts">
	import {
		FileCheck,
		UploadCloud,
		Search,
		CheckCircle2,
		AlertCircle,
		Clock,
		ArrowRight,
		RefreshCw
	} from 'lucide-svelte';

	interface Props {
		items?: any[];
	}

	let { items = [] }: Props = $props();

	const mockBankStatements = [
		{
			id: '1',
			date: '2026-11-12',
			bank: 'Bank Mandiri (123-00-1122334)',
			refNo: 'TRF-ASTRA-9021',
			invoiceRef: 'INV/2026/11/0002',
			amount: 9424000,
			status: 'MATCHED',
			message: 'Nominal transfer pas 100% dengan invoice INV/2026/11/0002'
		},
		{
			id: '2',
			date: '2026-11-13',
			bank: 'BCA (001-229-8871)',
			refNo: 'TRF-UNKNOWN-332',
			invoiceRef: 'UNKNOWN',
			amount: 15000000,
			status: 'UNMATCHED',
			message: 'Berita transfer tidak mencantumkan nomor invoice yang valid'
		},
		{
			id: '3',
			date: '2026-11-13',
			bank: 'Bank Mandiri (123-00-1122334)',
			refNo: 'TRF-BCA-CORP-01',
			invoiceRef: 'INV/2026/10/0045',
			amount: 10000000,
			status: 'PARTIAL',
			message: 'Pembayaran sebagian (Outstanding tersisa IDR 10.735.000)'
		}
	];

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
					Module G &bull; Flow I
				</span>
				<span class="text-xs text-zinc-400">Bank Statement Auto-Matching & Inward Clearance</span>
			</div>
			<h2 class="text-2xl font-bold tracking-tight text-white mt-1">Bank Statement Handling</h2>
			<p class="text-xs text-zinc-400 mt-0.5">
				Import mutasi rekening koran, deteksi pembayaran lebih/kurang, auto-match referensi transfer, dan penyelesaian gantung.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<label class="flex items-center gap-2 bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm cursor-pointer">
				<UploadCloud class="w-4 h-4" />
				<span>Import Bank MT940 / CSV</span>
				<input type="file" accept=".csv, .txt, .xlsx" class="hidden" />
			</label>
		</div>
	</div>

	<!-- Stats Overview -->
	<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Total Mutasi Masuk</span>
			<p class="text-xl font-bold font-mono text-white mt-1">34 Transaksi</p>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Matched Clean</span>
			<p class="text-xl font-bold font-mono text-emerald-400 mt-1">29</p>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Partial Payments</span>
			<p class="text-xl font-bold font-mono text-blue-400 mt-1">3</p>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a]">
			<span class="text-xs text-zinc-400">Unmatched / Review</span>
			<p class="text-xl font-bold font-mono text-amber-400 mt-1">2</p>
		</div>
	</div>

	<!-- Bank Statement List -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl overflow-hidden shadow-lg">
		<div class="p-4 border-b border-[#27272a] flex items-center justify-between bg-[#1F2025]/50">
			<span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Riwayat Mutasi Terkini</span>
			<button class="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition">
				<RefreshCw class="w-3.5 h-3.5" />
				<span>Sinkronkan Mutasi API</span>
			</button>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-[#101114] text-zinc-400 border-b border-[#27272a] uppercase font-semibold">
					<tr>
						<th class="p-3.5">Tanggal Mutasi</th>
						<th class="p-3.5">Bank Penampung</th>
						<th class="p-3.5">Referensi Berita</th>
						<th class="p-3.5">Invoice Terkait</th>
						<th class="p-3.5 text-right">Nominal Masuk</th>
						<th class="p-3.5 text-center">Status Matching</th>
						<th class="p-3.5">Catatan Sistem</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#27272a]">
					{#each mockBankStatements as row}
						<tr class="hover:bg-[#1F2025]/50 transition">
							<td class="p-3.5 font-mono text-zinc-300">{row.date}</td>
							<td class="p-3.5 text-white font-medium">{row.bank}</td>
							<td class="p-3.5 font-mono text-zinc-300">{row.refNo}</td>
							<td class="p-3.5 font-mono font-bold text-white">{row.invoiceRef}</td>
							<td class="p-3.5 text-right font-mono font-bold text-emerald-400">{formatCurrency(row.amount)}</td>
							<td class="p-3.5 text-center">
								<span
									class="px-2 py-0.5 rounded text-[10px] font-bold font-mono {row.status === 'MATCHED'
										? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
										: row.status === 'PARTIAL'
										? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
										: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}"
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


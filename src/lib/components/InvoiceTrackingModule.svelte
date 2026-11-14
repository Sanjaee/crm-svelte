<script lang="ts">
	import {
		Search,
		Compass,
		CheckCircle2,
		Clock,
		ArrowRight,
		FileText,
		Calendar,
		User
	} from 'lucide-svelte';

	interface Props {
		invoices?: any[];
	}

	let { invoices = [] }: Props = $props();

	let searchQuery = $state('');
	let trackedInvoice = $state<any>(null);

	function handleSearch() {
		if (!searchQuery.trim()) {
			trackedInvoice = null;
			return;
		}
		const q = searchQuery.toLowerCase().trim();
		trackedInvoice =
			invoices.find(
				(inv) =>
					inv.invoiceNo?.toLowerCase().includes(q) ||
					inv.flightReservations?.[0]?.pnrCode?.toLowerCase().includes(q)
			) || null;
	}

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
					Module D &bull; Tracking
				</span>
				<span class="text-xs text-zinc-400">Global Timeline & Audit Lifecycle</span>
			</div>
			<h2 class="text-2xl font-bold tracking-tight text-white mt-1">Invoice Tracking</h2>
			<p class="text-xs text-zinc-400 mt-0.5">
				Pelacakan instan posisi dokumen invoice, status persetujuan, mutasi pembayaran, dan riwayat audit trail.
			</p>
		</div>
	</div>

	<!-- Tracking Search Hero -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-6 shadow-md">
		<h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Cari Dokumen Invoice atau PNR</h3>
		<div class="flex items-center gap-3">
			<div class="relative flex-1">
				<Search class="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
				<input
					type="text"
					bind:value={searchQuery}
					onkeydown={(e) => e.key === 'Enter' && handleSearch()}
					placeholder="Masukkan Nomor Invoice (misal: INV/2026/11/0001) atau Kode PNR (WT-GA901)..."
					class="w-full bg-[#101114] border border-[#27272a] rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#EF233C]"
				/>
			</div>
			<button
				onclick={handleSearch}
				class="bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition shadow-sm"
			>
				Track Now
			</button>
		</div>
	</div>

	<!-- Search Result & Audit Timeline -->
	{#if trackedInvoice}
		<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-6 space-y-6">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#27272a] gap-2">
				<div>
					<span class="text-xs text-zinc-500 font-mono">INVOICE TRACKING RESULT</span>
					<h3 class="text-lg font-bold text-white font-mono">{trackedInvoice.invoiceNo}</h3>
				</div>
				<span class="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
					Current State: {trackedInvoice.invoiceStatus}
				</span>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
				<div class="p-3.5 rounded-lg bg-[#101114] border border-[#27272a]">
					<span class="text-zinc-500 block">Total Tagihan (Sell)</span>
					<span class="text-base font-bold font-mono text-emerald-400">{formatCurrency(trackedInvoice.billingAmount)}</span>
				</div>
				<div class="p-3.5 rounded-lg bg-[#101114] border border-[#27272a]">
					<span class="text-zinc-500 block">Metode Pembayaran</span>
					<span class="text-base font-bold font-mono text-white">{trackedInvoice.paymentType}</span>
				</div>
				<div class="p-3.5 rounded-lg bg-[#101114] border border-[#27272a]">
					<span class="text-zinc-500 block">Petugas Pembuat (Ticketing)</span>
					<span class="text-base font-bold font-mono text-zinc-300">{trackedInvoice.submittedByUserNo || 'Sarah Ticketing'}</span>
				</div>
			</div>

			<!-- Visual Flowchart Lifecycle -->
			<div class="space-y-4 pt-4 border-t border-[#27272a]">
				<h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">WahanaTravel Audit Trail & Status Timeline</h4>
				
				<div class="relative pl-6 space-y-6 border-l-2 border-[#27272a] ml-3 text-xs">
					<div class="relative">
						<div class="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#101114]"></div>
						<span class="text-[10px] text-zinc-500 font-mono">10 Nov 2026 10:00:00</span>
						<p class="font-bold text-white">Invoice Submitted</p>
						<p class="text-zinc-400 text-[11px]">Dibuat oleh Sarah Ticketing (USR-TCK-001) untuk penerbangan GA-402 PNR WT-GA901.</p>
					</div>

					<div class="relative">
						<div class="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-[#101114]"></div>
						<span class="text-[10px] text-zinc-500 font-mono">10 Nov 2026 14:15:00</span>
						<p class="font-bold text-white">Document Verification Completed</p>
						<p class="text-zinc-400 text-[11px]">Tiket dan lampiran voucher divalidasi oleh Supervisor (USR-SPV-001).</p>
					</div>

					<div class="relative">
						<div class="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-[#101114]"></div>
						<span class="text-[10px] text-zinc-500 font-mono">Pending Next Step</span>
						<p class="font-bold text-zinc-300">Menunggu Pembayaran / Alokasi Rekening Koran</p>
						<p class="text-zinc-500 text-[11px]">Menunggu alokasi dari modul Payment Receipt & Bank Statement Handling.</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="p-12 text-center bg-[#18191D] border border-[#27272a] rounded-xl text-zinc-500 text-xs">
			<Compass class="w-10 h-10 mx-auto mb-3 text-zinc-600" />
			<span>Ketik nomor invoice atau kode PNR di atas untuk melihat alur status dan riwayat lengkap.</span>
		</div>
	{/if}
</div>


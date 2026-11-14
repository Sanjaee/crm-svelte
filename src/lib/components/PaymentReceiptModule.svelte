<script lang="ts">
	import {
		CreditCard,
		Plus,
		Search,
		CheckCircle2,
		AlertCircle,
		Clock,
		ArrowRight,
		FileCheck,
		DollarSign
	} from 'lucide-svelte';

	interface Props {
		payments?: any[];
		unsettledInvoices?: any[];
	}

	let { payments = [], unsettledInvoices = [] }: Props = $props();

	let selectedPayment = $state(payments[0] || null);
	let allocationAmount = $state('');
	let selectedInvoiceId = $state('');

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
					Module H &bull; Flow K
				</span>
				<span class="text-xs text-zinc-400">Payment Receipt & Multi-Invoice Allocation</span>
			</div>
			<h2 class="text-2xl font-bold tracking-tight text-white mt-1">Payment Receipts & Settlement</h2>
			<p class="text-xs text-zinc-400 mt-0.5">
				Pencatatan bukti penerimaan kas/bank, alokasi multi-invoice, parsial payment, dan settlement piutang.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<button class="flex items-center gap-2 bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm">
				<Plus class="w-4 h-4" />
				<span>Record New Receipt</span>
			</button>
		</div>
	</div>

	<!-- Top Stats Banner -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a] flex items-center justify-between">
			<div>
				<span class="text-xs text-zinc-400">Total Payments Received</span>
				<p class="text-lg font-bold font-mono text-white mt-0.5">{formatCurrency(50000000)}</p>
			</div>
			<div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
				<DollarSign class="w-5 h-5" />
			</div>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a] flex items-center justify-between">
			<div>
				<span class="text-xs text-zinc-400">Allocated to Invoices</span>
				<p class="text-lg font-bold font-mono text-emerald-400 mt-0.5">{formatCurrency(9424000)}</p>
			</div>
			<div class="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
				<CheckCircle2 class="w-5 h-5" />
			</div>
		</div>
		<div class="p-4 rounded-xl bg-[#18191D] border border-[#27272a] flex items-center justify-between">
			<div>
				<span class="text-xs text-zinc-400">Unallocated Funds (Excess)</span>
				<p class="text-lg font-bold font-mono text-amber-400 mt-0.5">{formatCurrency(40576000)}</p>
			</div>
			<div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
				<Clock class="w-5 h-5" />
			</div>
		</div>
	</div>

	<!-- Two-column Layout: Payment List + Allocation Workspace -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
		<!-- Left: Payment Receipts List -->
		<div class="lg:col-span-5 space-y-4">
			<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-4 space-y-3">
				<h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400">Payment Receipts</h3>
				
				<div class="space-y-2.5">
					{#each payments as p}
						<button
							onclick={() => (selectedPayment = p)}
							class="w-full text-left p-3.5 rounded-lg border transition {selectedPayment?.id === p.id
								? 'bg-[#1F2025] border-[#EF233C]'
								: 'bg-[#101114]/60 border-[#27272a] hover:border-zinc-600'}"
						>
							<div class="flex items-center justify-between">
								<span class="text-xs font-mono font-bold text-white">{p.paymentNo}</span>
								<span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
									{p.allocationStatus}
								</span>
							</div>
							<p class="text-sm font-mono font-bold text-emerald-400 mt-1.5">
								{formatCurrency(p.amount)}
							</p>
							<div class="mt-2 pt-2 border-t border-[#27272a] text-[11px] text-zinc-400 space-y-1">
								<div class="flex justify-between">
									<span>Allocated:</span>
									<span class="font-mono text-zinc-200">{formatCurrency(p.allocatedAmount)}</span>
								</div>
								<div class="flex justify-between">
									<span>Unallocated:</span>
									<span class="font-mono text-amber-300">{formatCurrency(p.unallocatedAmount)}</span>
								</div>
								<div class="text-[10px] text-zinc-500 truncate pt-1">
									Account: {p.receivedAccount}
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Right: Allocation Action Console -->
		<div class="lg:col-span-7">
			{#if selectedPayment}
				<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-6 space-y-6">
					<div class="flex items-center justify-between pb-4 border-b border-[#27272a]">
						<div>
							<h3 class="text-sm font-bold text-white">Alokasi Penerimaan Dana ke Invoice</h3>
							<p class="text-xs text-zinc-400">Pilih invoice yang belum lunas untuk dialokasikan.</p>
						</div>
						<span class="text-xs font-mono bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded">
							Receipt: {selectedPayment.paymentNo}
						</span>
					</div>

					<!-- Payment Overview Card -->
					<div class="p-4 rounded-lg bg-[#101114] border border-[#27272a] grid grid-cols-2 gap-4 text-xs">
						<div>
							<span class="text-zinc-500 block">Dana Siap Dialokasikan:</span>
							<span class="text-base font-bold font-mono text-amber-400">
								{formatCurrency(selectedPayment.unallocatedAmount)}
							</span>
						</div>
						<div>
							<span class="text-zinc-500 block">Metode / Bank Penampung:</span>
							<span class="text-zinc-300 block truncate font-medium">
								{selectedPayment.receivedAccount}
							</span>
						</div>
					</div>

					<!-- Allocation Form -->
					<div class="space-y-4">
						<div class="space-y-1.5">
							<label class="text-xs font-semibold text-zinc-300">Pilih Invoice Belum Lunas (Unsettled Invoices)</label>
							<select
								bind:value={selectedInvoiceId}
								class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#EF233C]"
							>
								<option value="">-- Pilih Invoice Target --</option>
								{#each unsettledInvoices as inv}
									<option value={inv.id}>
										{inv.invoiceNo} &bull; {inv.customerName || 'PT Astra International'} &bull; Sisa: {formatCurrency(inv.billingAmount)}
									</option>
								{/each}
							</select>
						</div>

						<div class="space-y-1.5">
							<label class="text-xs font-semibold text-zinc-300">Nominal yang Dialokasikan (IDR)</label>
							<input
								type="number"
								bind:value={allocationAmount}
								placeholder="Masukkan nominal alokasi..."
								class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-[#EF233C]"
							/>
						</div>

						<div class="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
							<div class="flex items-center gap-1.5 font-bold">
								<FileCheck class="w-4 h-4" />
								<span>Aturan Transaksi Database (Atomic Settlement):</span>
							</div>
							<p class="text-[11px] leading-relaxed">
								Alokasi akan langsung membuat entri <code class="text-white">receipt_allocations</code>, mengurangi saldo piutang invoice, dan mengupdate status invoice menjadi PAID jika lunas atau PARTIAL jika sebagian.
							</p>
						</div>

						<button
							class="w-full flex items-center justify-center gap-2 bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-bold py-3 rounded-lg transition shadow-md shadow-red-500/20"
						>
							<CheckCircle2 class="w-4 h-4" />
							<span>Simpan Alokasi Pembayaran</span>
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>


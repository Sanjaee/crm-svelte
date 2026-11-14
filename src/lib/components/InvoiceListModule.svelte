<script lang="ts">
	import {
		Receipt,
		Search,
		Filter,
		Plus,
		ArrowRight,
		FileText,
		CheckCircle2,
		Clock,
		AlertCircle,
		Download
	} from 'lucide-svelte';

	interface Props {
		invoices?: any[];
		onSelectInvoice?: (id: string) => void;
	}

	let { invoices = [], onSelectInvoice = () => {} }: Props = $props();

	let searchQuery = $state('');
	let statusFilter = $state('ALL');

	function formatCurrency(val: any) {
		const num = Number(val || 0);
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
	}

	let filteredInvoices = $derived(
		invoices.filter((inv) => {
			const matchesQuery =
				inv.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				inv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				inv.bookingType?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'ALL' || inv.invoiceStatus === statusFilter;
			return matchesQuery && matchesStatus;
		})
	);
</script>

<div class="space-y-6">
	<!-- Module Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
		<div>
			<div class="flex items-center gap-2">
				<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EF233C]/10 text-[#EF233C] border border-[#EF233C]/30">
					Module C &bull; Operation
				</span>
				<span class="text-xs text-zinc-400">All Invoices & Operations</span>
			</div>
			<h2 class="text-2xl font-bold tracking-tight text-white mt-1">Invoice Management</h2>
			<p class="text-xs text-zinc-400 mt-0.5">
				Daftar seluruh invoice penerbangan, hotel, dan tour terbitan WahanaTravel beserta status approval & pembayaran.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<button class="flex items-center gap-2 bg-[#18191D] hover:bg-[#1F2025] border border-[#27272a] text-zinc-300 text-xs font-semibold px-3 py-2 rounded-lg transition">
				<Download class="w-4 h-4" />
				<span>Export XLSX</span>
			</button>
		</div>
	</div>

	<!-- Filter Bar -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-2 flex-1 min-w-[240px]">
			<Search class="w-4 h-4 text-zinc-500" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Cari nomor invoice, customer, booking type..."
				class="bg-transparent text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none w-full"
			/>
		</div>
		<div class="flex items-center gap-2">
			<Filter class="w-3.5 h-3.5 text-zinc-500" />
			<select
				bind:value={statusFilter}
				class="bg-[#101114] border border-[#27272a] rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-[#EF233C]"
			>
				<option value="ALL">All Status</option>
				<option value="DRAFT">DRAFT</option>
				<option value="SUBMITTED">SUBMITTED</option>
				<option value="CONFIRMED">CONFIRMED</option>
				<option value="PAID">PAID</option>
				<option value="PARTIAL">PARTIAL</option>
				<option value="VOID">VOID</option>
			</select>
		</div>
	</div>

	<!-- Invoices Table -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl overflow-hidden shadow-lg">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="bg-[#101114] text-zinc-400 border-b border-[#27272a] uppercase font-semibold">
					<tr>
						<th class="p-3.5">Invoice No</th>
						<th class="p-3.5">Customer</th>
						<th class="p-3.5">Booking Type</th>
						<th class="p-3.5 text-right">Net Fare</th>
						<th class="p-3.5 text-right">Fee / GST</th>
						<th class="p-3.5 text-right">Billing Amount</th>
						<th class="p-3.5 text-center">Status</th>
						<th class="p-3.5">Submitted By</th>
						<th class="p-3.5 text-center">Action</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#27272a]">
					{#each filteredInvoices as inv}
						<tr class="hover:bg-[#1F2025]/50 transition">
							<td class="p-3.5 font-mono font-bold text-white">{inv.invoiceNo}</td>
							<td class="p-3.5 text-zinc-200 font-medium">{inv.customerName || 'PT Astra International'}</td>
							<td class="p-3.5">
								<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#101114] border border-[#27272a] text-zinc-300">
									{inv.bookingType}
								</span>
							</td>
							<td class="p-3.5 text-right font-mono text-zinc-300">{formatCurrency(inv.netFare)}</td>
							<td class="p-3.5 text-right font-mono text-zinc-400">{formatCurrency(inv.serviceFee)}</td>
							<td class="p-3.5 text-right font-mono font-bold text-emerald-400">{formatCurrency(inv.billingAmount)}</td>
							<td class="p-3.5 text-center">
								<span
									class="px-2 py-0.5 rounded text-[10px] font-mono font-bold {inv.invoiceStatus === 'CONFIRMED'
										? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
										: inv.invoiceStatus === 'SUBMITTED'
										? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
										: 'bg-zinc-800 text-zinc-300'}"
								>
									{inv.invoiceStatus}
								</span>
							</td>
							<td class="p-3.5 text-zinc-400 font-mono text-[11px]">{inv.submittedByUserNo || 'SYSTEM'}</td>
							<td class="p-3.5 text-center">
								<button
									onclick={() => onSelectInvoice(inv.id)}
									class="p-1 rounded hover:bg-[#27272a] text-zinc-400 hover:text-white transition"
									title="View Details"
								>
									<ArrowRight class="w-4 h-4" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>


<script lang="ts">
	import { Clock, AlertTriangle, Calendar, PhoneCall, CheckCircle2 } from 'lucide-svelte';

	interface Props {
		invoices?: any[];
	}

	let { invoices = [] }: Props = $props();

	let overdueInvoices = $derived(
		invoices.filter((inv) => inv.overdueDays && inv.overdueDays > 0).length > 0
			? invoices
					.filter((inv) => inv.overdueDays && inv.overdueDays > 0)
					.map((inv) => ({
						id: inv.id,
						invoiceNo: inv.invoiceNo,
						customer: inv.customerName || 'PT Bank Central Asia Tbk',
						dueDate: inv.overdueDate || '31 Okt 2026',
						totalBilling: Number(inv.billingAmount || 0),
						overdueDays: inv.overdueDays || 14,
						penalty: (Number(inv.billingAmount || 0) * 0.02),
						promiseDate: '20 Nov 2026',
						promiseAmount: Number(inv.billingAmount || 0),
						status: 'OVERDUE'
					}))
			: [
					{
						id: '1',
						invoiceNo: 'INV/2026/10/0045',
						customer: 'PT Bank Central Asia Tbk',
						dueDate: '31 Okt 2026',
						totalBilling: 20735000,
						overdueDays: 14,
						penalty: 414700,
						promiseDate: '20 Nov 2026',
						promiseAmount: 20735000,
						status: 'OVERDUE'
					}
			  ]
	);
</script>

<div class="px-4 lg:px-6 space-y-6">
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-6">
		<div class="flex items-center justify-between pb-4 border-b border-[#27272a]">
			<div>
				<h2 class="text-base font-bold text-white flex items-center gap-2">
					<Clock class="w-5 h-5 text-amber-400" />
					Invoice Overdue Tracking (Flow F — WahanaTravel Specification)
				</h2>
				<p class="text-xs text-zinc-400 mt-1">
					Deteksi jatuh tempo otomatis, perhitungan denda keterlambatan (penalty), janji bayar, dan reminder follow-up.
				</p>
			</div>
		</div>

		<div class="mt-4 overflow-x-auto">
			<table class="w-full text-left text-xs border-collapse">
				<thead class="bg-[#101114] text-zinc-400 border-b border-[#27272a]">
					<tr>
						<th class="px-4 py-3 font-semibold text-zinc-300">Invoice No</th>
						<th class="px-4 py-3 font-semibold text-zinc-300">Customer B2B</th>
						<th class="px-4 py-3 font-semibold text-zinc-300">Jatuh Tempo</th>
						<th class="px-4 py-3 text-right font-semibold text-zinc-300">Total Tagihan</th>
						<th class="px-4 py-3 text-center font-semibold text-zinc-300">Hari Telat</th>
						<th class="px-4 py-3 text-right font-semibold text-zinc-300">Penalty</th>
						<th class="px-4 py-3 font-semibold text-zinc-300">Janji Bayar (Tgl & Nominal)</th>
						<th class="px-4 py-3 text-right font-semibold text-zinc-300">Follow Up</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#27272a]">
					{#each overdueInvoices as inv}
						<tr class="hover:bg-[#1F2025]/60 transition">
							<td class="px-4 py-3 font-mono font-medium text-white">{inv.invoiceNo}</td>
							<td class="px-4 py-3 text-zinc-200">{inv.customer}</td>
							<td class="px-4 py-3 text-zinc-400">{inv.dueDate}</td>
							<td class="px-4 py-3 text-right font-mono font-semibold text-zinc-200">
								IDR {inv.totalBilling.toLocaleString('id-ID')}
							</td>
							<td class="px-4 py-3 text-center">
								<span class="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
									+{inv.overdueDays} Hari
								</span>
							</td>
							<td class="px-4 py-3 text-right font-mono text-amber-400 font-semibold">
								IDR {inv.penalty.toLocaleString('id-ID')}
							</td>
							<td class="px-4 py-3 text-zinc-300 font-mono">
								{inv.promiseDate} (IDR {inv.promiseAmount.toLocaleString('id-ID')})
							</td>
							<td class="px-4 py-3 text-right">
								<button
									onclick={() => alert(`Pengingat follow up untuk ${inv.customer} telah dikirim ke PIC!`)}
									class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1F2025] hover:bg-[#27272a] border border-zinc-700 text-zinc-200 text-xs transition"
								>
									<PhoneCall class="w-3.5 h-3.5 text-amber-400" />
									<span>Reminder</span>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>


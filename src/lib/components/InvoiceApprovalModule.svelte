<script lang="ts">
	import { CheckSquare, Check, X, AlertTriangle, FileText, MessageSquare } from 'lucide-svelte';

	let sampleInvoices = $state([
		{
			id: '1',
			invoiceNo: 'INV/2026/11/0088',
			customer: 'PT Astra International Tbk',
			pnr: 'GA-77192',
			amount: 14250000,
			status: 'SUBMITTED',
			submittedBy: 'Ticketing 01',
			date: '14 Nov 2026'
		},
		{
			id: '2',
			invoiceNo: 'INV/2026/11/0087',
			customer: 'PT Bank Central Asia',
			pnr: 'SQ-99214',
			amount: 28900000,
			status: 'SUBMITTED',
			submittedBy: 'Ticketing 02',
			date: '14 Nov 2026'
		},
		{
			id: '3',
			invoiceNo: 'INV/2026/11/0085',
			customer: 'Kementerian Keuangan RI',
			pnr: 'GA-11204',
			amount: 8750000,
			status: 'SUBMITTED',
			submittedBy: 'Ticketing 01',
			date: '13 Nov 2026'
		}
	]);

	let rejectModalOpen = $state(false);
	let selectedInvoice = $state<any>(null);
	let rejectReason = $state('');

	function approveInvoice(inv: any) {
		inv.status = 'CONFIRMED';
		alert(`Invoice ${inv.invoiceNo} berhasil di-APPROVE! Status sekarang CONFIRMED sesuai Flow C.`);
	}

	function openRejectModal(inv: any) {
		selectedInvoice = inv;
		rejectReason = '';
		rejectModalOpen = true;
	}

	function confirmReject() {
		if (!rejectReason) {
			alert('Sesuai spesifikasi WahanaTravel: Wajib mengisi komentar/alasan reject!');
			return;
		}
		if (selectedInvoice) {
			selectedInvoice.status = 'SUBMITTED (Rejected: Perlu Koreksi)';
			alert(`Invoice ${selectedInvoice.invoiceNo} telah di-REJECT dengan catatan: "${rejectReason}". Status tetap SUBMITTED untuk revisi Ticketing.`);
		}
		rejectModalOpen = false;
	}
</script>

<div class="px-4 lg:px-6 space-y-6">
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-6">
		<div class="flex items-center justify-between pb-4 border-b border-[#27272a]">
			<div>
				<h2 class="text-base font-bold text-white flex items-center gap-2">
					<CheckSquare class="w-5 h-5 text-emerald-400" />
					Invoice Approval (Flow C — Accounting AR / Supervisor)
				</h2>
				<p class="text-xs text-zinc-400 mt-1">
					Role: Accounting AR / Supervisor. Approve menghasilkan <strong>CONFIRMED</strong>, Reject wajib disertai komentar dan tetap <strong>SUBMITTED</strong>.
				</p>
			</div>
		</div>

		<div class="mt-4 overflow-x-auto">
			<table class="w-full text-left text-xs border-collapse">
				<thead class="bg-[#101114] text-zinc-400 border-b border-[#27272a]">
					<tr>
						<th class="px-4 py-3 font-semibold text-zinc-300">Invoice No</th>
						<th class="px-4 py-3 font-semibold text-zinc-300">Customer B2B</th>
						<th class="px-4 py-3 font-semibold text-zinc-300">PNR</th>
						<th class="px-4 py-3 text-right font-semibold text-zinc-300">Total Tagihan</th>
						<th class="px-4 py-3 font-semibold text-zinc-300">Status</th>
						<th class="px-4 py-3 font-semibold text-zinc-300">Submitted By</th>
						<th class="px-4 py-3 text-right font-semibold text-zinc-300">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#27272a]">
					{#each sampleInvoices as inv}
						<tr class="hover:bg-[#1F2025]/60 transition">
							<td class="px-4 py-3 font-mono font-medium text-white">{inv.invoiceNo}</td>
							<td class="px-4 py-3 text-zinc-200">{inv.customer}</td>
							<td class="px-4 py-3 font-mono text-zinc-300">{inv.pnr}</td>
							<td class="px-4 py-3 text-right font-mono font-bold text-emerald-400">
								IDR {inv.amount.toLocaleString('id-ID')}
							</td>
							<td class="px-4 py-3">
								<span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold {inv.status === 'CONFIRMED'
									? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
									: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
									{inv.status}
								</span>
							</td>
							<td class="px-4 py-3 text-zinc-400">{inv.submittedBy} ({inv.date})</td>
							<td class="px-4 py-3 text-right">
								{#if inv.status === 'SUBMITTED'}
									<div class="inline-flex items-center gap-1.5">
										<button
											onclick={() => approveInvoice(inv)}
											class="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
											title="Approve Invoice"
										>
											<Check class="w-3.5 h-3.5" />
											<span>Approve</span>
										</button>
										<button
											onclick={() => openRejectModal(inv)}
											class="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 font-medium transition"
											title="Reject with Comment"
										>
											<X class="w-3.5 h-3.5" />
											<span>Reject</span>
										</button>
									</div>
								{:else}
									<span class="text-[11px] text-zinc-500 font-medium">Processed</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Modal Reject with mandatory comment -->
	{#if rejectModalOpen}
		<div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div class="w-full max-w-md bg-[#18191D] border border-zinc-700 rounded-xl p-6 space-y-4">
				<div class="flex items-center gap-2 text-rose-400">
					<AlertTriangle class="w-5 h-5" />
					<h3 class="text-base font-bold text-white">Reject Invoice {selectedInvoice?.invoiceNo}</h3>
				</div>
				<p class="text-xs text-zinc-400">
					Sesuai Diagram AI Flow C: Penolakan wajib memberikan komentar/alasan agar Ticketing dapat memperbaiki rincian.
				</p>
				<div class="space-y-1.5">
					<label class="text-xs font-semibold text-zinc-300">Catatan Perbaikan (Wajib)</label>
					<textarea
						bind:value={rejectReason}
						rows="3"
						placeholder="Contoh: Net fare dan PNR tidak cocok dengan dokumen Agent Voucher..."
						class="w-full bg-[#101114] border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#EF233C]"
					></textarea>
				</div>
				<div class="flex items-center justify-end gap-2 pt-2">
					<button
						onclick={() => (rejectModalOpen = false)}
						class="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 transition"
					>
						Batal
					</button>
					<button
						onclick={confirmReject}
						class="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs text-white font-semibold transition"
					>
						Konfirmasi Reject
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

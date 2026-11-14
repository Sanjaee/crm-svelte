<script lang="ts">
	import {
		Receipt,
		UploadCloud,
		Plane,
		Hotel,
		UserCheck,
		FileText,
		CheckCircle2,
		ArrowRight,
		ArrowLeft,
		DollarSign
	} from 'lucide-svelte';

	let step = $state(1); // 1 = Invoice Info, 2 = Payment Info
	let bookingType = $state('FLIGHT');
	let customerName = $state('PT Telkom Indonesia (MOU)');
	let pnrCode = $state('GA-882941');
	let netFare = $state('4500000');
	let serviceFee = $state('150000');
	let discount = $state('50000');
	let gst = $state('11');
	let paymentType = $state('TOP');
	let isSubmitted = $state(false);

	let totalSell = $derived(
		(Number(netFare) || 0) +
		(Number(serviceFee) || 0) -
		(Number(discount) || 0) +
		((Number(netFare) || 0) * (Number(gst) || 0)) / 100
	);

	function handleSubmit() {
		isSubmitted = true;
	}
</script>

<div class="px-4 lg:px-6 space-y-6">
	<!-- Flow Stepper Header -->
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-6">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#27272a]">
			<div>
				<h2 class="text-base font-bold text-white flex items-center gap-2">
					<Receipt class="w-5 h-5 text-[#EF233C]" />
					New Invoice (Flow B — WahanaTravel Specification)
				</h2>
				<p class="text-xs text-zinc-400 mt-1">
					Ikuti alur 2 langkah: Step 1 (Input Dokumen & Reservasi) &rarr; Step 2 (Konfigurasi Pembayaran).
				</p>
			</div>

			<!-- Stepper Indicator -->
			<div class="flex items-center gap-2 select-none">
				<button
					onclick={() => (step = 1)}
					class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition {step === 1
						? 'bg-[#EF233C] text-white'
						: 'bg-[#1F2025] text-zinc-400 border border-[#27272a]'}"
				>
					<span class="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">1</span>
					<span>Step 1: Invoice Info</span>
				</button>
				<div class="w-4 h-px bg-zinc-700"></div>
				<button
					onclick={() => (step = 2)}
					class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition {step === 2
						? 'bg-[#EF233C] text-white'
						: 'bg-[#1F2025] text-zinc-400 border border-[#27272a]'}"
				>
					<span class="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">2</span>
					<span>Step 2: Payment Info</span>
				</button>
			</div>
		</div>

		{#if isSubmitted}
			<div class="mt-6 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-2">
				<CheckCircle2 class="w-10 h-10 mx-auto text-emerald-400" />
				<h3 class="text-base font-bold text-white">Invoice SUBMITTED Successfully!</h3>
				<p class="text-xs text-zinc-300">
					Invoice No: <code class="font-mono text-emerald-300">INV/2026/11/0089</code> • Status: <strong class="text-emerald-400">SUBMITTED</strong>
				</p>
				<p class="text-xs text-zinc-400">
					Sesuai alur, invoice ini kini masuk ke antrian <strong>Accounting AR / Supervisor Approval</strong>.
				</p>
				<button
					onclick={() => { isSubmitted = false; step = 1; }}
					class="mt-3 px-4 py-2 rounded-lg bg-[#1F2025] border border-zinc-700 text-xs text-white hover:bg-zinc-800 transition"
				>
					Buat Invoice Lainnya
				</button>
			</div>
		{:else if step === 1}
			<!-- STEP 1: Invoice Information -->
			<div class="mt-6 space-y-6">
				<!-- Section 1: Documents Upload -->
				<div class="space-y-3">
					<h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
						<UploadCloud class="w-4 h-4 text-[#EF233C]" />
						1. Upload Documents (Agent Voucher, E-Ticket, Payment Proof)
					</h3>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div class="border border-dashed border-zinc-700 rounded-lg p-4 text-center hover:border-[#EF233C] transition cursor-pointer bg-[#101114]">
							<UploadCloud class="w-5 h-5 mx-auto text-zinc-500 mb-1" />
							<span class="text-xs font-semibold text-zinc-300 block">Agent Voucher</span>
							<span class="text-[10px] text-zinc-500">PDF, JPG, PNG (Max 5MB)</span>
						</div>
						<div class="border border-dashed border-zinc-700 rounded-lg p-4 text-center hover:border-[#EF233C] transition cursor-pointer bg-[#101114]">
							<UploadCloud class="w-5 h-5 mx-auto text-zinc-500 mb-1" />
							<span class="text-xs font-semibold text-zinc-300 block">E-Ticket / Booking Slip</span>
							<span class="text-[10px] text-zinc-500">PDF, JPG, PNG</span>
						</div>
						<div class="border border-dashed border-zinc-700 rounded-lg p-4 text-center hover:border-[#EF233C] transition cursor-pointer bg-[#101114]">
							<UploadCloud class="w-5 h-5 mx-auto text-zinc-500 mb-1" />
							<span class="text-xs font-semibold text-zinc-300 block">Payment Proof</span>
							<span class="text-[10px] text-zinc-500">Bukti Transfer / DP</span>
						</div>
					</div>
				</div>

				<!-- Section 2: Booking Info -->
				<div class="space-y-3 pt-4 border-t border-[#27272a]">
					<h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
						<FileText class="w-4 h-4 text-[#EF233C]" />
						2. Booking Information
					</h3>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
						<div class="space-y-1">
							<label class="text-zinc-400">Customer (B2B Business Profile)</label>
							<input
								type="text"
								bind:value={customerName}
								class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-[#EF233C]"
							/>
						</div>
						<div class="space-y-1">
							<label class="text-zinc-400">Booking Type</label>
							<select
								bind:value={bookingType}
								class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-[#EF233C]"
							>
								<option value="FLIGHT">Flight Reservation</option>
								<option value="HOTEL">Hotel Reservation</option>
								<option value="TOUR">Tour Package</option>
								<option value="OTHERS">Other Services</option>
							</select>
						</div>
						<div class="space-y-1">
							<label class="text-zinc-400">PNR Code</label>
							<input
								type="text"
								bind:value={pnrCode}
								class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-[#EF233C] font-mono"
							/>
						</div>
					</div>
				</div>

				<!-- Section 3: Route & Pax Info -->
				<div class="space-y-3 pt-4 border-t border-[#27272a]">
					<h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
						<Plane class="w-4 h-4 text-[#EF233C]" />
						3. Route & Passenger Details
					</h3>
					<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
						<div class="space-y-1">
							<label class="text-zinc-400">Airline / Vendor</label>
							<input type="text" value="Garuda Indonesia (GA)" class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200" />
						</div>
						<div class="space-y-1">
							<label class="text-zinc-400">Flight No</label>
							<input type="text" value="GA-402" class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200" />
						</div>
						<div class="space-y-1">
							<label class="text-zinc-400">Route (Origin &rarr; Dest)</label>
							<input type="text" value="CGK &rarr; DPS" class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200" />
						</div>
						<div class="space-y-1">
							<label class="text-zinc-400">Passenger Count</label>
							<input type="text" value="1 Adult, 0 Child" class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200" />
						</div>
					</div>
				</div>

				<!-- Section 4: Billing Information -->
				<div class="space-y-3 pt-4 border-t border-[#27272a]">
					<h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
						<DollarSign class="w-4 h-4 text-[#EF233C]" />
						4. Billing & Price Calculation
					</h3>
					<div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
						<div class="space-y-1">
							<label class="text-zinc-400">Net Fare (IDR)</label>
							<input type="number" bind:value={netFare} class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 text-right font-mono" />
						</div>
						<div class="space-y-1">
							<label class="text-zinc-400">Service Fee (IDR)</label>
							<input type="number" bind:value={serviceFee} class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 text-right font-mono" />
						</div>
						<div class="space-y-1">
							<label class="text-zinc-400">Discount (IDR)</label>
							<input type="number" bind:value={discount} class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 text-right font-mono" />
						</div>
						<div class="space-y-1">
							<label class="text-zinc-400">GST / PPN (%)</label>
							<input type="number" bind:value={gst} class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 text-right font-mono" />
						</div>
						<div class="col-span-2 sm:col-span-1 space-y-1">
							<label class="text-emerald-400 font-semibold">Total Sell (IDR)</label>
							<div class="w-full bg-[#1F2025] border border-emerald-500/40 rounded-lg p-2.5 text-emerald-400 font-bold text-right font-mono text-sm">
								{totalSell.toLocaleString('id-ID')}
							</div>
						</div>
					</div>
				</div>

				<!-- Step 1 Navigation Buttons -->
				<div class="pt-4 flex items-center justify-between border-t border-[#27272a]">
					<button
						onclick={() => alert('Draft tersimpan di database local!')}
						class="px-4 py-2 rounded-lg bg-[#1F2025] hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition"
					>
						Save Draft
					</button>
					<button
						onclick={() => (step = 2)}
						class="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-semibold shadow-sm transition"
					>
						<span>Continue to Step 2</span>
						<ArrowRight class="w-4 h-4" />
					</button>
				</div>
			</div>
		{:else if step === 2}
			<!-- STEP 2: Payment Information -->
			<div class="mt-6 space-y-6">
				<div class="p-4 rounded-xl bg-[#101114] border border-[#27272a]">
					<h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400">Step 2 — Payment Configuration</h3>
					<p class="text-xs text-zinc-400 mt-1">
						Pilih jenis pembayaran, rekening tujuan, dan termin jatuh tempo (TOP) sebelum submit ke Accounting.
					</p>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
					<div class="space-y-1">
						<label class="text-zinc-400">Payment Type</label>
						<select
							bind:value={paymentType}
							class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-[#EF233C]"
						>
							<option value="TOP">Term of Payment (TOP / Kredit)</option>
							<option value="TRANSFER">Bank Transfer (Langsung)</option>
							<option value="CASH">Cash</option>
							<option value="CREDIT">Customer Credit Deposit</option>
						</select>
					</div>

					<div class="space-y-1">
						<label class="text-zinc-400">Due Date (Jatuh Tempo)</label>
						<input type="date" value="2026-12-14" class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200" />
					</div>

					<div class="space-y-1">
						<label class="text-zinc-400">Destination Account (Bank)</label>
						<select class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-zinc-200">
							<option value="BCA">BCA - 1289024881 (PT Wahana Travelindo)</option>
							<option value="MANDIRI">Mandiri - 13700192837 (PT Wahana Travelindo)</option>
						</select>
					</div>
				</div>

				<div class="p-4 rounded-lg bg-[#1F2025] border border-zinc-700/60 flex items-center justify-between text-xs">
					<div>
						<span class="text-zinc-400 block">Total Tagihan Final:</span>
						<span class="text-lg font-bold text-white font-mono">IDR {totalSell.toLocaleString('id-ID')}</span>
					</div>
					<div class="text-right">
						<span class="text-zinc-400 block">Status awal saat submit:</span>
						<span class="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-[#EF233C]/20 text-[#EF233C] border border-[#EF233C]/30">
							SUBMITTED
						</span>
					</div>
				</div>

				<!-- Step 2 Navigation Buttons -->
				<div class="pt-4 flex items-center justify-between border-t border-[#27272a]">
					<button
						onclick={() => (step = 1)}
						class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1F2025] hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition"
					>
						<ArrowLeft class="w-4 h-4" />
						<span>Kembali ke Step 1</span>
					</button>

					<div class="flex items-center gap-2">
						<button
							onclick={() => alert('Draft diupdate!')}
							class="px-4 py-2 rounded-lg bg-[#1F2025] hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition"
						>
							Update Draft
						</button>
						<button
							onclick={handleSubmit}
							class="px-6 py-2 rounded-lg bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-bold shadow-md shadow-red-500/20 transition"
						>
							Submit Invoice
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

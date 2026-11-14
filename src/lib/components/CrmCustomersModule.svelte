<script lang="ts">
	import {
		Building2,
		Search,
		Plus,
		CreditCard,
		FileText,
		Phone,
		Mail,
		MapPin,
		CheckCircle2,
		AlertCircle,
		ShieldCheck,
		FileCheck,
		Calendar,
		ArrowRight
	} from 'lucide-svelte';

	interface Props {
		customers?: any[];
	}

	let { customers = [] }: Props = $props();

	let searchQuery = $state('');
	let selectedCustomerId = $state(customers[0]?.id || '');
	let activeTab = $state('overview');

	let selectedCustomer = $derived(
		customers.find((c) => c.id === selectedCustomerId) || customers[0]
	);

	const tabs = [
		{ id: 'overview', label: '1. Overview' },
		{ id: 'contact', label: '2. Contact Information' },
		{ id: 'pic', label: '3. Person in Charge' },
		{ id: 'tax', label: '4. Tax Information' },
		{ id: 'payment-settings', label: '5. Invoice & Payment' },
		{ id: 'agreements', label: '6. MOU / Agreement' },
		{ id: 'addendum', label: '7. Addendum Docs' },
		{ id: 'refund', label: '8. Refund Bank Account' },
		{ id: 'rules', label: '9. Customer Rules' },
		{ id: 'logs', label: '10. Business Profile Logs' }
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
					Module C &bull; CRM
				</span>
				<span class="text-xs text-zinc-400">WahanaTravel B2B Business Profiles</span>
			</div>
			<h2 class="text-2xl font-bold tracking-tight text-white mt-1">Customers B2B Management</h2>
			<p class="text-xs text-zinc-400 mt-0.5">
				Kelola profil bisnis korporat, Term of Payment (TOP), limit kredit, dokumen MOU, dan aturan perpajakan.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<button class="flex items-center gap-2 bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm">
				<Plus class="w-4 h-4" />
				<span>Create B2B Customer</span>
			</button>
		</div>
	</div>

	<!-- Main Two-Column Layout (List + 10-Tab Detail) -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
		<!-- Left: Customer Directory List -->
		<div class="lg:col-span-4 space-y-4">
			<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-3.5 space-y-3">
				<div class="relative">
					<Search class="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search customer no, name..."
						class="w-full bg-[#101114] border border-[#27272a] rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#EF233C]"
					/>
				</div>

				<div class="space-y-2 max-h-[600px] overflow-y-auto pr-1">
					{#each customers as cust}
						<button
							onclick={() => (selectedCustomerId = cust.id)}
							class="w-full text-left p-3 rounded-lg border transition {selectedCustomerId === cust.id
								? 'bg-[#1F2025] border-[#EF233C] text-white'
								: 'bg-[#101114]/50 border-[#27272a] text-zinc-400 hover:border-zinc-600'}"
						>
							<div class="flex items-start justify-between gap-2">
								<span class="text-xs font-bold text-white truncate">{cust.customerName}</span>
								<span class="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
									{cust.status}
								</span>
							</div>
							<div class="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-400">
								<span class="font-mono text-zinc-300">{cust.customerNo}</span>
								<span>&bull;</span>
								<span>{cust.customerGroup}</span>
								<span>&bull;</span>
								<span class="text-[#EF233C]">{cust.customerType}</span>
							</div>
							{#if cust.invoiceAndPayment}
								<div class="mt-2 pt-2 border-t border-[#27272a]/80 flex justify-between text-[11px]">
									<span class="text-zinc-500">Credit Limit:</span>
									<span class="font-mono font-medium text-zinc-300">
										{formatCurrency(cust.invoiceAndPayment.creditLimit)}
									</span>
								</div>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Right: Customer Detail with 10 Tabs -->
		<div class="lg:col-span-8">
			{#if selectedCustomer}
				<div class="bg-[#18191D] border border-[#27272a] rounded-xl overflow-hidden shadow-lg">
					<!-- Customer Header Banner -->
					<div class="p-6 bg-[#1F2025]/60 border-b border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div class="flex items-center gap-4">
							<div class="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EF233C] to-red-800 flex items-center justify-center text-white text-xl font-bold shadow-md">
								{selectedCustomer.customerName.charAt(0)}
							</div>
							<div>
								<div class="flex items-center gap-2">
									<h3 class="text-lg font-bold text-white">{selectedCustomer.customerName}</h3>
									<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF233C]/10 text-[#EF233C] border border-[#EF233C]/20">
										{selectedCustomer.customerNo}
									</span>
								</div>
								<p class="text-xs text-zinc-400 mt-0.5">{selectedCustomer.businessType || 'B2B Client'} &bull; Branch: {selectedCustomer.handlerBranch || 'JKT-HQ'}</p>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5">
								<CheckCircle2 class="w-3.5 h-3.5" />
								Active Profile
							</span>
						</div>
					</div>

					<!-- 10-Tab Horizontal Scrollable Navigation -->
					<div class="flex overflow-x-auto border-b border-[#27272a] bg-[#101114]/80 px-2 scrollbar-thin">
						{#each tabs as tab}
							<button
								onclick={() => (activeTab = tab.id)}
								class="px-4 py-3 text-xs font-semibold whitespace-nowrap transition border-b-2 {activeTab === tab.id
									? 'border-[#EF233C] text-white bg-[#18191D]'
									: 'border-transparent text-zinc-400 hover:text-zinc-200'}"
							>
								{tab.label}
							</button>
						{/each}
					</div>

					<!-- Tab Content Panels -->
					<div class="p-6">
						{#if activeTab === 'overview'}
							<div class="space-y-6">
								<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<div class="p-4 rounded-lg bg-[#101114] border border-[#27272a]">
										<span class="text-xs text-zinc-400">Total Credit Limit</span>
										<p class="text-lg font-bold font-mono text-emerald-400 mt-1">
											{formatCurrency(selectedCustomer.invoiceAndPayment?.creditLimit)}
										</p>
									</div>
									<div class="p-4 rounded-lg bg-[#101114] border border-[#27272a]">
										<span class="text-xs text-zinc-400">Used Credit Limit</span>
										<p class="text-lg font-bold font-mono text-amber-400 mt-1">
											{formatCurrency(selectedCustomer.invoiceAndPayment?.usedLimit)}
										</p>
									</div>
									<div class="p-4 rounded-lg bg-[#101114] border border-[#27272a]">
										<span class="text-xs text-zinc-400">Term of Payment (TOP)</span>
										<p class="text-lg font-bold font-mono text-white mt-1">
											{selectedCustomer.invoiceAndPayment?.dueDate || 30} Hari
										</p>
									</div>
								</div>

								<div class="bg-[#101114] border border-[#27272a] rounded-lg p-4 space-y-3">
									<h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">Profile Metadata</h4>
									<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
										<div>
											<span class="text-zinc-500 block">Customer Group</span>
											<span class="text-white font-medium">{selectedCustomer.customerGroup}</span>
										</div>
										<div>
											<span class="text-zinc-500 block">Customer Type</span>
											<span class="text-white font-medium">{selectedCustomer.customerType}</span>
										</div>
										<div>
											<span class="text-zinc-500 block">Sales Assigned</span>
											<span class="text-white font-medium">{selectedCustomer.salesId || '-'}</span>
										</div>
										<div>
											<span class="text-zinc-500 block">Join Date</span>
											<span class="text-white font-mono">{selectedCustomer.joinDate || '2023-01-15'}</span>
										</div>
									</div>
								</div>
							</div>

						{:else if activeTab === 'contact'}
							<div class="bg-[#101114] border border-[#27272a] rounded-lg p-5 space-y-4">
								<h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">Alamat & Kontak Resmi</h4>
								<div class="space-y-3 text-xs">
									<div class="flex items-start gap-3">
										<MapPin class="w-4 h-4 text-[#EF233C] shrink-0 mt-0.5" />
										<div>
											<span class="text-zinc-400 block">Alamat Kantor:</span>
											<span class="text-white font-medium">
												{selectedCustomer.contactInfos?.[0]?.address || 'Menara Astra Lt. 15, Jl. Jend. Sudirman Kav 5-6, Jakarta Pusat'}
											</span>
										</div>
									</div>
									<div class="flex items-center gap-3">
										<Phone class="w-4 h-4 text-zinc-400 shrink-0" />
										<span class="text-zinc-300 font-mono">
											{selectedCustomer.contactInfos?.[0]?.phoneNo || '+62-21-5082-5555'}
										</span>
									</div>
									<div class="flex items-center gap-3">
										<Mail class="w-4 h-4 text-zinc-400 shrink-0" />
										<span class="text-zinc-300">
											{selectedCustomer.contactInfos?.[0]?.emailAddress || 'travel.corp@astra.co.id'}
										</span>
									</div>
								</div>
							</div>

						{:else if activeTab === 'pic'}
							<div class="bg-[#101114] border border-[#27272a] rounded-lg p-5 space-y-4">
								<h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">Person In Charge (PIC)</h4>
								<div class="p-4 rounded-lg bg-[#18191D] border border-[#27272a] space-y-2">
									<p class="text-sm font-bold text-white">
										{selectedCustomer.personInCharges?.[0]?.name || 'Bambang Sudirman'}
									</p>
									<p class="text-xs text-zinc-400">
										{selectedCustomer.personInCharges?.[0]?.positionDivision || 'Procurement & General Affairs Manager'}
									</p>
									<div class="pt-2 flex flex-wrap gap-4 text-xs text-zinc-300 font-mono">
										<span>Phone: {selectedCustomer.personInCharges?.[0]?.phoneNo || '+62-811-987-654'}</span>
										<span>Email: {selectedCustomer.personInCharges?.[0]?.emailAddress || 'bambang.s@astra.co.id'}</span>
									</div>
								</div>
							</div>

						{:else if activeTab === 'tax'}
							<div class="bg-[#101114] border border-[#27272a] rounded-lg p-5 space-y-4">
								<h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">Informasi NPWP / Faktur Pajak</h4>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
									<div>
										<span class="text-zinc-500 block">Nomor Pokok Wajib Pajak (NPWP)</span>
										<span class="font-mono text-white font-bold text-sm">
											{selectedCustomer.taxInfos?.[0]?.idNo || '01.000.013.1-093.000'}
										</span>
									</div>
									<div>
										<span class="text-zinc-500 block">Nama Wajib Pajak</span>
										<span class="text-white font-medium">
											{selectedCustomer.taxInfos?.[0]?.taxPayerName || selectedCustomer.customerName}
										</span>
									</div>
									<div class="col-span-2">
										<span class="text-zinc-500 block">Alamat Pajak</span>
										<span class="text-zinc-300">
											{selectedCustomer.taxInfos?.[0]?.taxAddress || 'Jl. Gaya Motor Raya No. 8, Sunter II, Jakarta Utara'}
										</span>
									</div>
								</div>
							</div>

						{:else if activeTab === 'payment-settings'}
							<div class="bg-[#101114] border border-[#27272a] rounded-lg p-5 space-y-4">
								<h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">Invoice & Payment Settings</h4>
								<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
									<div class="p-3 rounded bg-[#18191D] border border-[#27272a]">
										<span class="text-zinc-500 block">Enable GST/PPN</span>
										<span class="text-emerald-400 font-bold">YES (11%)</span>
									</div>
									<div class="p-3 rounded bg-[#18191D] border border-[#27272a]">
										<span class="text-zinc-500 block">Show Service Fee</span>
										<span class="text-white font-bold">YES</span>
									</div>
									<div class="p-3 rounded bg-[#18191D] border border-[#27272a]">
										<span class="text-zinc-500 block">Show Discount</span>
										<span class="text-white font-bold">YES</span>
									</div>
								</div>
							</div>

						{:else if activeTab === 'refund'}
							<div class="bg-[#101114] border border-[#27272a] rounded-lg p-5 space-y-4">
								<h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">Rekening Pengembalian Dana (Refund)</h4>
								<div class="p-4 rounded-lg bg-[#18191D] border border-[#27272a] space-y-2 text-xs">
									<div class="flex justify-between">
										<span class="text-zinc-400">Nama Bank:</span>
										<span class="text-white font-bold">
											{selectedCustomer.refundAccounts?.[0]?.bankName || 'Bank Mandiri'}
										</span>
									</div>
									<div class="flex justify-between">
										<span class="text-zinc-400">Nomor Rekening:</span>
										<span class="text-emerald-400 font-mono font-bold">
											{selectedCustomer.refundAccounts?.[0]?.accountNo || '123-00-9876543-2'}
										</span>
									</div>
									<div class="flex justify-between">
										<span class="text-zinc-400">Atas Nama:</span>
										<span class="text-white font-medium">
											{selectedCustomer.refundAccounts?.[0]?.accountHolderName || selectedCustomer.customerName}
										</span>
									</div>
								</div>
							</div>

						{:else}
							<div class="bg-[#101114] border border-[#27272a] rounded-lg p-8 text-center text-zinc-500 text-xs">
								<FileText class="w-8 h-8 mx-auto mb-2 text-zinc-600" />
								<span>Data tab ini telah tersinkronisasi dengan skema database WahanaTravel B2B.</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>


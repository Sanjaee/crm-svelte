<script lang="ts">
	import {
		Building2,
		Receipt,
		CreditCard,
		CheckSquare,
		Clock,
		FileSpreadsheet,
		FileCheck,
		FileText,
		ArrowRight,
		ShieldCheck
	} from 'lucide-svelte';

	interface Props {
		activeModule?: string;
		onNavigate?: (moduleKey: string) => void;
		onSelectModule?: (moduleKey: string) => void;
	}

	let { activeModule = 'dashboard', onNavigate = () => {}, onSelectModule = () => {} }: Props = $props();

	function handleSelect(key: string) {
		onNavigate(key);
		onSelectModule(key);
	}
</script>

<div class="px-4 lg:px-6">
	<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-5 mb-6">
		<div class="flex items-center justify-between mb-4">
			<div>
				<h3 class="text-sm font-bold text-white flex items-center gap-2">
					<ShieldCheck class="w-4 h-4 text-[#EF233C]" />
					WahanaTravel Core Business Flow Navigation
				</h3>
				<p class="text-xs text-zinc-400 mt-0.5">
					Akses langsung ke setiap modul sesuai spesifikasi diagram WahanaTravel:
				</p>
			</div>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
			<button
				onclick={() => handleSelect('new-invoice')}
				class="flex flex-col items-start p-3 rounded-lg bg-[#1F2025] hover:bg-[#27272a] border border-[#27272a] hover:border-[#EF233C] transition text-left group"
			>
				<Receipt class="w-4 h-4 text-[#EF233C] mb-2" />
				<span class="text-xs font-semibold text-white group-hover:text-[#EF233C] transition">New Invoice</span>
				<span class="text-[10px] text-zinc-500 mt-0.5">Step 1 & 2 Workflow</span>
			</button>

			<button
				onclick={() => handleSelect('approval')}
				class="flex flex-col items-start p-3 rounded-lg bg-[#1F2025] hover:bg-[#27272a] border border-[#27272a] hover:border-[#EF233C] transition text-left group"
			>
				<CheckSquare class="w-4 h-4 text-emerald-400 mb-2" />
				<span class="text-xs font-semibold text-white group-hover:text-emerald-400 transition">Approval</span>
				<span class="text-[10px] text-zinc-500 mt-0.5">Ticketing & AR flow</span>
			</button>

			<button
				onclick={() => handleSelect('overdue')}
				class="flex flex-col items-start p-3 rounded-lg bg-[#1F2025] hover:bg-[#27272a] border border-[#27272a] hover:border-[#EF233C] transition text-left group"
			>
				<Clock class="w-4 h-4 text-amber-400 mb-2" />
				<span class="text-xs font-semibold text-white group-hover:text-amber-400 transition">Overdue</span>
				<span class="text-[10px] text-zinc-500 mt-0.5">Due date & penalty</span>
			</button>

			<button
				onclick={() => handleSelect('payment-receipt')}
				class="flex flex-col items-start p-3 rounded-lg bg-[#1F2025] hover:bg-[#27272a] border border-[#27272a] hover:border-[#EF233C] transition text-left group"
			>
				<CreditCard class="w-4 h-4 text-blue-400 mb-2" />
				<span class="text-xs font-semibold text-white group-hover:text-blue-400 transition">Payments</span>
				<span class="text-[10px] text-zinc-500 mt-0.5">Receipt & Allocation</span>
			</button>

			<button
				onclick={() => handleSelect('vendor-billing')}
				class="flex flex-col items-start p-3 rounded-lg bg-[#1F2025] hover:bg-[#27272a] border border-[#27272a] hover:border-[#EF233C] transition text-left group"
			>
				<FileSpreadsheet class="w-4 h-4 text-purple-400 mb-2" />
				<span class="text-xs font-semibold text-white group-hover:text-purple-400 transition">Vendor Billing</span>
				<span class="text-[10px] text-zinc-500 mt-0.5">Reconciliation</span>
			</button>

			<button
				onclick={() => handleSelect('bank-statement')}
				class="flex flex-col items-start p-3 rounded-lg bg-[#1F2025] hover:bg-[#27272a] border border-[#27272a] hover:border-[#EF233C] transition text-left group"
			>
				<FileCheck class="w-4 h-4 text-cyan-400 mb-2" />
				<span class="text-xs font-semibold text-white group-hover:text-cyan-400 transition">Bank Statement</span>
				<span class="text-[10px] text-zinc-500 mt-0.5">Cross Matching</span>
			</button>
		</div>
	</div>
</div>


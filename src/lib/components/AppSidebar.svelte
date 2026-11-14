<script lang="ts">
	import {
		LayoutDashboard,
		FileText,
		Receipt,
		CreditCard,
		CheckSquare,
		FileCheck,
		Clock,
		FileSpreadsheet,
		Building2,
		Settings,
		PlusCircle,
		Mail,
		MoreVertical,
		ExternalLink
	} from 'lucide-svelte';

	interface Props {
		collapsed?: boolean;
		activeModule?: string;
		onSelectModule?: (moduleKey: string) => void;
	}

	let { collapsed = false, activeModule = 'dashboard', onSelectModule = () => {} }: Props = $props();

	// Primary WahanaTravel Flow Modules
	const coreModules = [
		{ key: 'dashboard', title: 'Dashboard', icon: LayoutDashboard },
		{ key: 'new-invoice', title: 'New Invoice', icon: PlusCircle, badge: 'Step 1 & 2' },
		{ key: 'invoices', title: 'Invoice List', icon: Receipt },
		{ key: 'approval', title: 'Invoice Approval', icon: CheckSquare },
		{ key: 'overdue', title: 'Invoice Overdue', icon: Clock },
		{ key: 'payment-receipt', title: 'Payment Receipt', icon: CreditCard },
		{ key: 'vendor-billing', title: 'Vendor Billing', icon: FileSpreadsheet },
		{ key: 'bank-statement', title: 'Bank Statement', icon: FileCheck },
		{ key: 'crm-customers', title: 'CRM Customers', icon: Building2 },
		{ key: 'daily-report', title: 'Daily Report', icon: FileText }
	];
</script>

<aside
	class="flex flex-col border-r border-[#27272a] bg-[#101114] text-zinc-300 transition-all duration-200 select-none {collapsed
		? 'w-16'
		: 'w-64'} h-screen sticky top-0 shrink-0"
>
	<!-- Brand Header -->
	<div class="h-14 flex items-center px-4 border-b border-[#27272a]/80 gap-3 shrink-0">
		<div class="w-8 h-8 rounded-lg bg-[#EF233C] flex items-center justify-center font-bold text-white shadow-md shadow-red-500/20 shrink-0">
			W
		</div>
		{#if !collapsed}
			<div class="flex flex-col truncate">
				<span class="text-sm font-semibold tracking-tight text-white">WahanaTravel</span>
				<span class="text-[11px] text-zinc-500 font-medium">Enterprise CRM</span>
			</div>
		{/if}
	</div>

	<!-- Scrollable Nav Modules with subtle custom scrollbar -->
	<div class="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4">
		<!-- Quick Create Action -->
		<div class="space-y-1">
			<button
				onclick={() => onSelectModule('new-invoice')}
				class="w-full flex items-center justify-center gap-2 bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm transition"
				title="New Invoice"
			>
				<PlusCircle class="w-4 h-4 shrink-0" />
				{#if !collapsed}<span>New Invoice</span>{/if}
			</button>
		</div>

		<!-- Flow Navigation -->
		<div class="space-y-1">
			{#if !collapsed}
				<span class="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Business Flow</span>
			{/if}
			{#each coreModules as item}
				<button
					onclick={() => onSelectModule(item.key)}
					class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition {activeModule === item.key
						? 'bg-[#1F2025] text-white border border-[#27272a]'
						: 'text-zinc-400 hover:bg-[#18191D] hover:text-white'}"
					title={item.title}
				>
					<div class="flex items-center gap-3 truncate">
						<item.icon class="w-4 h-4 shrink-0 {activeModule === item.key ? 'text-[#EF233C]' : ''}" />
						{#if !collapsed}
							<span class="truncate">{item.title}</span>
						{/if}
					</div>
					{#if !collapsed && item.badge}
						<span class="text-[10px] bg-[#EF233C]/10 text-[#EF233C] border border-[#EF233C]/20 px-1.5 py-0.2 rounded font-medium">
							{item.badge}
						</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- User Profile Footer -->
	<div class="p-3 border-t border-[#27272a] bg-[#101114] shrink-0">
		<div class="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#18191D] transition cursor-pointer">
			<div class="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-xs text-white">
				WT
			</div>
			{#if !collapsed}
				<div class="flex-1 min-w-0">
					<p class="text-xs font-semibold text-white truncate">Wahana Admin</p>
					<p class="text-[11px] text-zinc-500 truncate">admin@wahanatravel.com</p>
				</div>
				<MoreVertical class="w-4 h-4 text-zinc-500" />
			{/if}
		</div>
	</div>
</aside>

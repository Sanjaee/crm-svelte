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
		ShieldCheck,
		PlusCircle,
		LogOut,
		Compass
	} from 'lucide-svelte';

	interface Props {
		collapsed?: boolean;
		activeModule?: string;
		currentUserRole?: string;
		onSelectModule?: (moduleKey: string) => void;
	}

	let {
		collapsed = false,
		activeModule = 'dashboard',
		currentUserRole = 'ADMIN',
		onSelectModule = () => {}
	}: Props = $props();

	// All modules with permission mapping
	const allModules = [
		{ key: 'dashboard', title: 'Dashboard', icon: LayoutDashboard, perm: 'dashboard.view' },
		{ key: 'crm-customers', title: 'Customers B2B', icon: Building2, perm: 'customers.view' },
		{ key: 'new-invoice', title: 'New Invoice', icon: PlusCircle, badge: 'Step 1 & 2', perm: 'invoices.create' },
		{ key: 'invoices', title: 'Invoice List', icon: Receipt, perm: 'invoices.view' },
		{ key: 'approval', title: 'Invoice Approval', icon: CheckSquare, perm: 'invoices.approve' },
		{ key: 'overdue', title: 'Invoice Overdue', icon: Clock, perm: 'invoice_overdue.view' },
		{ key: 'tracking', title: 'Invoice Tracking', icon: Compass, perm: 'invoice_tracking.view' },
		{ key: 'payment-receipt', title: 'Payment Receipt', icon: CreditCard, perm: 'payments.view' },
		{ key: 'vendor-billing', title: 'Vendor Billing', icon: FileSpreadsheet, perm: 'vendor_billing.view' },
		{ key: 'bank-statement', title: 'Bank Statement', icon: FileCheck, perm: 'bank_statement.view' },
		{ key: 'daily-report', title: 'Daily Report', icon: FileText, perm: 'reports.daily_payment.view' },
		{ key: 'admin-users', title: 'User Management & RBAC', icon: ShieldCheck, perm: 'users.view' }
	];

	// Role-Based Allowed Module Keys
	const roleModulesMap: Record<string, string[]> = {
		SUPER_ADMIN: [
			'dashboard',
			'crm-customers',
			'new-invoice',
			'invoices',
			'approval',
			'overdue',
			'tracking',
			'payment-receipt',
			'vendor-billing',
			'bank-statement',
			'daily-report',
			'admin-users'
		],
		ADMIN: [
			'dashboard',
			'crm-customers',
			'new-invoice',
			'invoices',
			'approval',
			'overdue',
			'tracking',
			'payment-receipt',
			'vendor-billing',
			'bank-statement',
			'daily-report',
			'admin-users'
		],
		TICKETING: [
			'dashboard',
			'crm-customers',
			'new-invoice',
			'invoices',
			'tracking'
		],
		SUPERVISOR: [
			'dashboard',
			'crm-customers',
			'invoices',
			'approval',
			'overdue',
			'tracking',
			'daily-report'
		],
		ACCOUNTING_AR: [
			'dashboard',
			'crm-customers',
			'invoices',
			'approval',
			'overdue',
			'tracking',
			'payment-receipt',
			'vendor-billing',
			'bank-statement',
			'daily-report'
		],
		ACCOUNTING_AP: [
			'dashboard',
			'tracking',
			'invoices',
			'payment-receipt',
			'daily-report'
		],
		ACCOUNTING_TAX: [
			'dashboard',
			'tracking',
			'daily-report'
		],
		ACCOUNTING_FINANCE: [
			'dashboard',
			'tracking',
			'payment-receipt',
			'bank-statement',
			'daily-report'
		]
	};

	let allowedKeys = $derived(
		roleModulesMap[currentUserRole] || roleModulesMap['SUPER_ADMIN']
	);

	let filteredModules = $derived(
		allModules.filter((m) => allowedKeys.includes(m.key))
	);
</script>

<aside
	class="bg-[#101114] border-r border-[#27272a] flex flex-col transition-all duration-300 z-50 {collapsed
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
				<span class="text-xs font-bold text-white tracking-wide">WahanaTravel</span>
				<span class="text-[10px] text-zinc-400 font-mono">Enterprise CRM</span>
			</div>
		{/if}
	</div>

	<!-- Scrollable Nav Modules with subtle custom scrollbar -->
	<div class="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4">
		<!-- Flow Navigation -->
		<div class="space-y-1">
			{#if !collapsed}
				<span class="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Authorized Modules</span>
			{/if}
			{#each filteredModules as item}
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
				<div class="flex-1 truncate text-xs">
					<p class="font-semibold text-white truncate">Wahana User</p>
					<p class="text-[10px] font-mono text-[#EF233C] truncate">{currentUserRole}</p>
				</div>
			{/if}
		</div>
	</div>
</aside>

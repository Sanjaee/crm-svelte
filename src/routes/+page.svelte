<script lang="ts">
	import type { PageData } from './$types';
	import AppSidebar from '#lib/components/AppSidebar.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SectionCards from '#lib/components/SectionCards.svelte';
	import ChartAreaInteractive from '#lib/components/ChartAreaInteractive.svelte';
	import DataTable from '#lib/components/DataTable.svelte';
	import FlowNavigationBanner from '#lib/components/FlowNavigationBanner.svelte';
	import NewInvoiceModule from '#lib/components/NewInvoiceModule.svelte';
	import InvoiceListModule from '#lib/components/InvoiceListModule.svelte';
	import InvoiceApprovalModule from '#lib/components/InvoiceApprovalModule.svelte';
	import InvoiceOverdueModule from '#lib/components/InvoiceOverdueModule.svelte';
	import InvoiceTrackingModule from '#lib/components/InvoiceTrackingModule.svelte';
	import CrmCustomersModule from '#lib/components/CrmCustomersModule.svelte';
	import PaymentReceiptModule from '#lib/components/PaymentReceiptModule.svelte';
	import VendorBillingModule from '#lib/components/VendorBillingModule.svelte';
	import BankStatementModule from '#lib/components/BankStatementModule.svelte';
	import DailyPaymentReportModule from '#lib/components/DailyPaymentReportModule.svelte';
	import proposalsData from '#lib/data/proposals.json';
	import { Database, ShieldCheck, UserCheck } from 'lucide-svelte';
	import { MOCK_USERS, type UserRole } from '#lib/auth.js';

	let { data }: { data: PageData } = $props();

	let sidebarCollapsed = $state(false);
	let activeModule = $state('dashboard');
	let currentRole = $state<UserRole>('ADMIN');

	let currentUser = $derived(MOCK_USERS[currentRole]);

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}

	function handleModuleSelect(key: string) {
		activeModule = key;
	}

	const titlesMap: Record<string, string> = {
		'dashboard': 'Dashboard & Overview',
		'new-invoice': 'New Invoice (Step 1 & 2)',
		'invoices': 'Invoice Management & List',
		'approval': 'Invoice Approval & Review',
		'overdue': 'Invoice Overdue Tracking',
		'payment-receipt': 'Payment Receipt & Allocation',
		'vendor-billing': 'Vendor Billing Reconciliation',
		'bank-statement': 'Bank Statement Handling',
		'crm-customers': 'CRM B2B Customer Profiles',
		'daily-report': 'Daily Payment Report',
		'tracking': 'Invoice Global Tracking'
	};
</script>

<svelte:head>
	<title>WahanaTravel CRM & Back Office — {titlesMap[activeModule] || 'Dashboard'}</title>
</svelte:head>

<div class="flex min-h-screen bg-[#101114] text-white">
	<!-- Collapsible App Sidebar with custom shadcn-style dark scrollbar -->
	<AppSidebar
		collapsed={sidebarCollapsed}
		{activeModule}
		onSelectModule={handleModuleSelect}
	/>

	<!-- Main Inset Content Area -->
	<div class="flex-1 flex flex-col min-w-0">
		<!-- Site Header with User & Role Selector -->
		<div class="h-14 border-b border-[#27272a] bg-[#101114]/90 backdrop-blur px-4 flex items-center justify-between sticky top-0 z-40">
			<SiteHeader
				{sidebarCollapsed}
				onToggleSidebar={toggleSidebar}
				currentModuleTitle={titlesMap[activeModule] || 'Dashboard'}
			/>

			<!-- Role Switcher for Testing Live Workflows -->
			<div class="flex items-center gap-3">
				<div class="flex items-center gap-1.5 bg-[#18191D] border border-[#27272a] rounded-lg px-2.5 py-1 text-xs">
					<UserCheck class="w-3.5 h-3.5 text-[#EF233C]" />
					<span class="text-zinc-400">Active Role:</span>
					<select
						bind:value={currentRole}
						class="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
					>
						<option value="ADMIN" class="bg-[#18191D]">ADMIN (Super User)</option>
						<option value="TICKETING" class="bg-[#18191D]">TICKETING (Ops Staff)</option>
						<option value="SUPERVISOR" class="bg-[#18191D]">SUPERVISOR (Approver)</option>
						<option value="ACCOUNTING_AR" class="bg-[#18191D]">ACCOUNTING AR (Billing/Reconcile)</option>
						<option value="ACCOUNTING_AP" class="bg-[#18191D]">ACCOUNTING AP (Disbursement)</option>
						<option value="ACCOUNTING_TAX" class="bg-[#18191D]">ACCOUNTING TAX (PPN/Faktur)</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Page Content Container -->
		<main class="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
			<!-- Neon PostgreSQL Real-time Connection Status Banner -->
			{#if data.databaseConnected}
				<div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-400">
					<div class="flex items-center gap-2.5">
						<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
						<Database class="w-4 h-4 text-emerald-400" />
						<span class="font-bold text-emerald-300">Neon PostgreSQL Live</span>
						<span class="text-emerald-500/60">&bull;</span>
						<span class="text-zinc-300 font-mono text-[11px]">{data.dbHost}</span>
						<span class="text-emerald-500/60">&bull;</span>
						<span class="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">{data.region}</span>
					</div>
					<div class="flex items-center gap-4 text-[11px] text-zinc-400">
						<span>Tables: <strong class="text-white font-mono">{data.tablesCount}</strong></span>
						<span>Customers: <strong class="text-emerald-400 font-mono">{data.customers?.length ?? 0}</strong></span>
						<span>Invoices: <strong class="text-emerald-400 font-mono">{data.invoices?.length ?? 0}</strong></span>
						<span>Payments: <strong class="text-emerald-400 font-mono">{data.payments?.length ?? 0}</strong></span>
					</div>
				</div>
			{/if}

			<!-- Flow Navigation Quick Switcher Banner -->
			<FlowNavigationBanner {activeModule} onSelectModule={handleModuleSelect} />

			<!-- Dynamic View Switcher based on Active Module -->
			{#if activeModule === 'dashboard'}
				<div class="space-y-6">
					<!-- 4 Top KPI Section Cards -->
					<SectionCards />

					<!-- Interactive Area Chart with Range Toggle -->
					<ChartAreaInteractive />

					<!-- TanStack Data Table for Proposal Management -->
					<DataTable data={proposalsData} />
				</div>

			{:else if activeModule === 'new-invoice'}
				<NewInvoiceModule customers={data.customers || []} />

			{:else if activeModule === 'invoices'}
				<InvoiceListModule invoices={data.invoices || []} onSelectInvoice={() => {}} />

			{:else if activeModule === 'approval'}
				<InvoiceApprovalModule invoices={data.invoices || []} />

			{:else if activeModule === 'overdue'}
				<InvoiceOverdueModule invoices={data.invoices || []} />

			{:else if activeModule === 'tracking'}
				<InvoiceTrackingModule invoices={data.invoices || []} />

			{:else if activeModule === 'crm-customers'}
				<CrmCustomersModule customers={data.customers || []} />

			{:else if activeModule === 'payment-receipt'}
				<PaymentReceiptModule
					payments={data.payments || []}
					unsettledInvoices={data.invoices || []}
				/>

			{:else if activeModule === 'vendor-billing'}
				<VendorBillingModule />

			{:else if activeModule === 'bank-statement'}
				<BankStatementModule />

			{:else if activeModule === 'daily-report'}
				<DailyPaymentReportModule summaryData={data.stats} />

			{/if}
		</main>
	</div>
</div>

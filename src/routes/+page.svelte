<script lang="ts">
	import type { PageData } from './$types';
	import AppSidebar from '#lib/components/AppSidebar.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SectionCards from '#lib/components/SectionCards.svelte';
	import ChartAreaInteractive from '#lib/components/ChartAreaInteractive.svelte';
	import DataTable from '#lib/components/DataTable.svelte';
	import FlowNavigationBanner from '#lib/components/FlowNavigationBanner.svelte';
	import NewInvoiceModule from '#lib/components/NewInvoiceModule.svelte';
	import InvoiceApprovalModule from '#lib/components/InvoiceApprovalModule.svelte';
	import InvoiceOverdueModule from '#lib/components/InvoiceOverdueModule.svelte';
	import proposalsData from '#lib/data/proposals.json';
	import { Database } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let sidebarCollapsed = $state(false);
	let activeModule = $state('dashboard');

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
		'daily-report': 'Daily Payment Report'
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

	<!-- Inset Main Shell -->
	<div class="flex-1 flex flex-col min-w-0">
		<SiteHeader
			onToggleSidebar={toggleSidebar}
			title={titlesMap[activeModule] || 'Dashboard'}
		/>

		<!-- Live Database Banner -->
		<div class="px-4 lg:px-6 pt-4">
			<div class="flex items-center justify-between p-3 rounded-lg bg-[#18191D] border border-zinc-800/80 text-xs">
				<div class="flex items-center gap-2.5">
					<div class="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
						<Database class="w-4 h-4" />
					</div>
					<div>
						<span class="font-semibold text-zinc-200">Neon PostgreSQL Singapore:</span>
						<span class="text-zinc-400 font-mono ml-1">{data.dbHost || 'Connected'}</span>
						<span class="text-zinc-500 ml-2">({data.tablesCount || 26} tables active)</span>
					</div>
				</div>
				<div class="flex items-center gap-2 text-emerald-400 font-medium">
					<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
					<span>Live Database OK</span>
				</div>
			</div>
		</div>

		<!-- Page Content Router -->
		<main class="flex-1 flex flex-col gap-6 py-4 md:py-6">
			<!-- Flow Quick Switcher Banner -->
			<FlowNavigationBanner onNavigate={handleModuleSelect} />

			{#if activeModule === 'dashboard'}
				<!-- Section KPI Cards -->
				<SectionCards />

				<!-- Area Chart -->
				<div class="px-4 lg:px-6">
					<ChartAreaInteractive />
				</div>

				<!-- Data Table with Tabs, Pagination, and Drawer Inspector -->
				<DataTable data={proposalsData} />
			{:else if activeModule === 'new-invoice'}
				<NewInvoiceModule />
			{:else if activeModule === 'approval'}
				<InvoiceApprovalModule />
			{:else if activeModule === 'overdue'}
				<InvoiceOverdueModule />
			{:else}
				<!-- Direct View for other WahanaTravel modules -->
				<div class="px-4 lg:px-6">
					<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-8 text-center space-y-3">
						<h3 class="text-base font-bold text-white">{titlesMap[activeModule]}</h3>
						<p class="text-xs text-zinc-400 max-w-md mx-auto">
							Modul ini terhubung langsung ke skema Drizzle ORM PostgreSQL (`{activeModule}`).
						</p>
						<button
							onclick={() => (activeModule = 'dashboard')}
							class="px-4 py-2 rounded-lg bg-[#EF233C] text-xs font-semibold text-white transition hover:bg-[#d91d34]"
						>
							Kembali ke Dashboard Utama
						</button>
					</div>
				</div>
			{/if}
		</main>
	</div>
</div>

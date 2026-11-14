<script lang="ts">
	import type { PageData } from './$types';
	import AppSidebar from '#lib/components/AppSidebar.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SectionCards from '#lib/components/SectionCards.svelte';
	import ChartAreaInteractive from '#lib/components/ChartAreaInteractive.svelte';
	import DataTable from '#lib/components/DataTable.svelte';
	import proposalsData from '#lib/data/proposals.json';
	import { Database, CheckCircle2, AlertCircle } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let sidebarCollapsed = $state(false);
	let activeNav = $state('Dashboard');

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<svelte:head>
	<title>WahanaTravel CRM & Back Office — Dashboard</title>
</svelte:head>

<div class="flex min-h-screen bg-[#101114] text-white">
	<!-- Collapsible App Sidebar -->
	<AppSidebar
		collapsed={sidebarCollapsed}
		{activeNav}
		onSelectNav={(nav) => (activeNav = nav)}
	/>

	<!-- Inset Content Area -->
	<div class="flex-1 flex flex-col min-w-0">
		<SiteHeader
			onToggleSidebar={toggleSidebar}
			title={activeNav === 'Dashboard' ? 'Documents' : activeNav}
		/>

		<!-- Database Live Indicator Strip -->
		<div class="px-4 lg:px-6 pt-4">
			<div class="flex items-center justify-between p-3 rounded-lg bg-[#18191D] border border-zinc-800/80 text-xs">
				<div class="flex items-center gap-2.5">
					<div class="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
						<Database class="w-4 h-4" />
					</div>
					<div>
						<span class="font-semibold text-zinc-200">Neon PostgreSQL Singapore:</span>
						<span class="text-zinc-400 font-mono ml-1">{data.dbHost || 'Connected'}</span>
						<span class="text-zinc-500 ml-2">({data.tablesCount || 26} tables ready)</span>
					</div>
				</div>
				<div class="flex items-center gap-2 text-emerald-400 font-medium">
					<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
					<span>Live Database OK</span>
				</div>
			</div>
		</div>

		<!-- Main Dashboard Sections -->
		<main class="flex-1 flex flex-col gap-6 py-4 md:py-6">
			<!-- Section Cards (Revenue, Customers, Accounts, Growth) -->
			<SectionCards />

			<!-- Interactive Area Chart (Total Visitors 3 Months) -->
			<div class="px-4 lg:px-6">
				<ChartAreaInteractive />
			</div>

			<!-- Dynamic Tabbed Data Table with Pagination & Inspector Drawer -->
			<DataTable data={proposalsData} />
		</main>
	</div>
</div>

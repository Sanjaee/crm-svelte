<script lang="ts">
	import {
		LayoutDashboard,
		RefreshCw,
		BarChart3,
		Folder,
		Users,
		Camera,
		FileText,
		FileSpreadsheet,
		FolderGit2,
		Sparkles,
		Database,
		FileCode,
		Settings,
		HelpCircle,
		Search,
		PlusCircle,
		Mail,
		MoreVertical,
		ChevronRight,
		ExternalLink
	} from 'lucide-svelte';

	interface Props {
		collapsed?: boolean;
		activeNav?: string;
		onSelectNav?: (nav: string) => void;
	}

	let { collapsed = false, activeNav = 'Dashboard', onSelectNav = () => {} }: Props = $props();

	const navMain = [
		{ title: 'Dashboard', icon: LayoutDashboard },
		{ title: 'Lifecycle', icon: RefreshCw },
		{ title: 'Analytics', icon: BarChart3 },
		{ title: 'Projects', icon: Folder },
		{ title: 'Team', icon: Users }
	];

	const navClouds = [
		{
			title: 'Capture',
			icon: Camera,
			items: ['Active Proposals', 'Archived']
		},
		{
			title: 'Proposal',
			icon: FileText,
			items: ['Active Proposals', 'Archived']
		},
		{
			title: 'Prompts',
			icon: Sparkles,
			items: ['Active Proposals', 'Archived']
		}
	];

	const documents = [
		{ name: 'Data Library', icon: Database },
		{ name: 'Reports', icon: FileSpreadsheet },
		{ name: 'Word Assistant', icon: FileCode }
	];

	const navSecondary = [
		{ title: 'Settings', icon: Settings },
		{ title: 'Get Help', icon: HelpCircle },
		{ title: 'Search', icon: Search }
	];
</script>

<aside
	class="flex flex-col border-r border-[#27272a] bg-[#101114] text-zinc-300 transition-all duration-200 select-none {collapsed
		? 'w-16'
		: 'w-64'} h-screen sticky top-0 shrink-0"
>
	<!-- Header / Brand -->
	<div class="h-14 flex items-center px-4 border-b border-[#27272a]/80 gap-3">
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

	<!-- Content -->
	<div class="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6">
		<!-- Quick Actions -->
		<div class="space-y-1">
			<div class="flex items-center gap-1.5">
				<button
					class="flex-1 flex items-center justify-center gap-2 bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm transition"
					title="Quick Create"
				>
					<PlusCircle class="w-4 h-4 shrink-0" />
					{#if !collapsed}<span>Quick Create</span>{/if}
				</button>
				{#if !collapsed}
					<button
						class="p-2 rounded-lg bg-[#18191D] hover:bg-[#1F2025] border border-[#27272a] text-zinc-400 hover:text-white transition"
						title="Inbox"
					>
						<Mail class="w-4 h-4" />
					</button>
				{/if}
			</div>
		</div>

		<!-- Main Nav -->
		<div class="space-y-1">
			{#if !collapsed}
				<span class="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Platform</span>
			{/if}
			{#each navMain as item}
				<button
					onclick={() => onSelectNav(item.title)}
					class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition {activeNav === item.title
						? 'bg-[#1F2025] text-white border border-[#27272a]'
						: 'text-zinc-400 hover:bg-[#18191D] hover:text-white'}"
					title={item.title}
				>
					<item.icon class="w-4 h-4 shrink-0 {activeNav === item.title ? 'text-[#EF233C]' : ''}" />
					{#if !collapsed}
						<span class="truncate">{item.title}</span>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Clouds / Sections -->
		{#if !collapsed}
			<div class="space-y-1">
				<span class="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Workspaces</span>
				{#each navClouds as group}
					<details class="group/cloud" open>
						<summary class="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:bg-[#18191D] hover:text-white cursor-pointer list-none">
							<div class="flex items-center gap-2.5">
								<group.icon class="w-3.5 h-3.5 text-zinc-500" />
								<span>{group.title}</span>
							</div>
							<ChevronRight class="w-3.5 h-3.5 transition group-open/cloud:rotate-90 text-zinc-500" />
						</summary>
						<div class="pl-7 pr-2 py-1 space-y-0.5">
							{#each group.items as sub}
								<button class="w-full text-left py-1 px-2 rounded text-xs text-zinc-400 hover:text-white hover:bg-[#18191D] transition truncate">
									{sub}
								</button>
							{/each}
						</div>
					</details>
				{/each}
			</div>

			<!-- Documents -->
			<div class="space-y-1">
				<span class="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Documents</span>
				{#each documents as doc}
					<button class="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:bg-[#18191D] hover:text-white transition group">
						<div class="flex items-center gap-2.5 truncate">
							<doc.icon class="w-3.5 h-3.5 text-zinc-500" />
							<span class="truncate">{doc.name}</span>
						</div>
						<MoreVertical class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-zinc-500" />
					</button>
				{/each}
			</div>
		{/if}

		<!-- Secondary Nav -->
		<div class="space-y-1 pt-4 border-t border-[#27272a]/60">
			{#each navSecondary as item}
				<button class="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:bg-[#18191D] hover:text-white transition">
					<item.icon class="w-4 h-4 shrink-0" />
					{#if !collapsed}<span class="truncate">{item.title}</span>{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- User Profile Footer -->
	<div class="p-3 border-t border-[#27272a] bg-[#101114]">
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

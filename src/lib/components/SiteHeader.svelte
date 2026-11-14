<script lang="ts">
	import { Sidebar, Search, Bell, ExternalLink } from 'lucide-svelte';

	interface Props {
		onToggleSidebar?: () => void;
		title?: string;
	}

	let { onToggleSidebar = () => {}, title = 'Documents' }: Props = $props();
</script>

<header class="h-14 border-b border-[#27272a] bg-[#101114] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shrink-0">
	<div class="flex items-center gap-3">
		<button
			onclick={onToggleSidebar}
			class="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-[#18191D] border border-transparent hover:border-[#27272a] transition"
			title="Toggle Sidebar"
		>
			<Sidebar class="w-4 h-4" />
		</button>
		<div class="h-4 w-px bg-[#27272a]"></div>
		<h1 class="text-sm font-semibold text-white tracking-tight">{title}</h1>
	</div>

	<div class="flex items-center gap-3">
		<div class="relative hidden sm:block">
			<Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
			<input
				type="text"
				placeholder="Search sections or documents..."
				class="bg-[#18191D] border border-[#27272a] rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#EF233C] w-64 transition"
			/>
		</div>

		<button class="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#18191D] border border-transparent hover:border-[#27272a] transition relative">
			<Bell class="w-4 h-4" />
			<span class="w-1.5 h-1.5 bg-[#EF233C] rounded-full absolute top-2 right-2"></span>
		</button>

		<a
			href="https://github.com/Sanjaee/crm-svelte"
			target="_blank"
			rel="noreferrer"
			class="hidden md:flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-[#18191D] border border-[#27272a] px-3 py-1.5 rounded-lg transition"
		>
			<span>GitHub</span>
			<ExternalLink class="w-3.5 h-3.5" />
		</a>
	</div>
</header>

<script lang="ts">
	import {
		GripVertical,
		CheckCircle2,
		Loader2,
		Columns3,
		Plus,
		ChevronLeft,
		ChevronRight,
		ChevronsLeft,
		ChevronsRight,
		MoreVertical,
		X
	} from 'lucide-svelte';

	interface ProposalItem {
		id: number;
		header: string;
		type: string;
		status: string;
		target: string;
		limit: string;
		reviewer: string;
	}

	interface Props {
		data: ProposalItem[];
	}

	let { data = [] }: Props = $props();

	// Tabs state
	let currentTab = $state('outline');

	// Pagination state
	let pageSize = $state(10);
	let currentPage = $state(0);

	// Selection state
	let selectedIds = $state<number[]>([]);

	// Drawer preview state
	let selectedItem = $state<ProposalItem | null>(null);

	// Search / Filter
	let searchFilter = $state('');

	let filteredItems = $derived(
		data.filter((item) =>
			searchFilter ? item.header.toLowerCase().includes(searchFilter.toLowerCase()) : true
		)
	);

	let totalPages = $derived(Math.ceil(filteredItems.length / pageSize) || 1);
	let paginatedItems = $derived(
		filteredItems.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
	);

	function toggleSelectAll() {
		if (selectedIds.length === paginatedItems.length) {
			selectedIds = [];
		} else {
			selectedIds = paginatedItems.map((i) => i.id);
		}
	}

	function toggleSelect(id: number) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((item) => item !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}
</script>

<div class="w-full flex flex-col gap-4">
	<!-- Tab Bar & Controls -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 lg:px-6">
		<!-- Tabs -->
		<div class="inline-flex items-center gap-1 bg-[#18191D] border border-[#27272a] rounded-lg p-1 self-start sm:self-auto">
			<button
				onclick={() => (currentTab = 'outline')}
				class="px-3 py-1.5 text-xs font-semibold rounded-md transition {currentTab === 'outline'
					? 'bg-[#27272a] text-white shadow-sm'
					: 'text-zinc-400 hover:text-white'}"
			>
				Outline
			</button>
			<button
				onclick={() => (currentTab = 'past-performance')}
				class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition {currentTab === 'past-performance'
					? 'bg-[#27272a] text-white shadow-sm'
					: 'text-zinc-400 hover:text-white'}"
			>
				<span>Past Performance</span>
				<span class="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full font-mono">3</span>
			</button>
			<button
				onclick={() => (currentTab = 'key-personnel')}
				class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition {currentTab === 'key-personnel'
					? 'bg-[#27272a] text-white shadow-sm'
					: 'text-zinc-400 hover:text-white'}"
			>
				<span>Key Personnel</span>
				<span class="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full font-mono">2</span>
			</button>
			<button
				onclick={() => (currentTab = 'focus-documents')}
				class="px-3 py-1.5 text-xs font-semibold rounded-md transition {currentTab === 'focus-documents'
					? 'bg-[#27272a] text-white shadow-sm'
					: 'text-zinc-400 hover:text-white'}"
			>
				Focus Documents
			</button>
		</div>

		<!-- Action Buttons -->
		<div class="flex items-center gap-2">
			<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18191D] border border-[#27272a] text-zinc-300 hover:text-white hover:bg-[#1F2025] transition">
				<Columns3 class="w-3.5 h-3.5" />
				<span>Customize Columns</span>
			</button>
			<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#EF233C] text-white hover:bg-[#d91d34] shadow-sm transition">
				<Plus class="w-3.5 h-3.5" />
				<span>Add Section</span>
			</button>
		</div>
	</div>

	<!-- Tab Content Outline (Main DataTable) -->
	{#if currentTab === 'outline'}
		<div class="px-4 lg:px-6">
			<div class="bg-[#18191D] border border-[#27272a] rounded-xl overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full text-left text-xs border-collapse">
						<thead class="bg-[#101114] text-zinc-400 border-b border-[#27272a] select-none font-medium">
							<tr>
								<th class="w-8 px-3 py-3"></th>
								<th class="w-8 px-2 py-3 text-center">
									<input
										type="checkbox"
										checked={selectedIds.length === paginatedItems.length && paginatedItems.length > 0}
										onchange={toggleSelectAll}
										class="rounded bg-[#1F2025] border-zinc-700 text-[#EF233C] focus:ring-0 focus:ring-offset-0 cursor-pointer"
									/>
								</th>
								<th class="px-4 py-3 font-semibold text-zinc-300">Header</th>
								<th class="px-4 py-3 font-semibold text-zinc-300">Section Type</th>
								<th class="px-4 py-3 font-semibold text-zinc-300">Status</th>
								<th class="px-4 py-3 text-right font-semibold text-zinc-300">Target</th>
								<th class="px-4 py-3 text-right font-semibold text-zinc-300">Limit</th>
								<th class="px-4 py-3 font-semibold text-zinc-300">Reviewer</th>
								<th class="w-10 px-3 py-3"></th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#27272a]">
							{#each paginatedItems as row (row.id)}
								<tr class="hover:bg-[#1F2025]/60 transition {selectedIds.includes(row.id) ? 'bg-[#1F2025]' : ''}">
									<!-- Drag Handle -->
									<td class="px-3 py-3 text-zinc-600 hover:text-zinc-400 cursor-grab">
										<GripVertical class="w-3.5 h-3.5" />
									</td>

									<!-- Checkbox -->
									<td class="px-2 py-3 text-center">
										<input
											type="checkbox"
											checked={selectedIds.includes(row.id)}
											onchange={() => toggleSelect(row.id)}
											class="rounded bg-[#1F2025] border-zinc-700 text-[#EF233C] focus:ring-0 focus:ring-offset-0 cursor-pointer"
										/>
									</td>

									<!-- Header (Click to open Drawer) -->
									<td class="px-4 py-3 font-medium text-white hover:text-[#EF233C] cursor-pointer transition" onclick={() => (selectedItem = row)}>
										{row.header}
									</td>

									<!-- Section Type Badge -->
									<td class="px-4 py-3">
										<span class="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#1F2025] border border-zinc-700 text-zinc-300">
											{row.type}
										</span>
									</td>

									<!-- Status Badge -->
									<td class="px-4 py-3">
										<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium {row.status === 'Done'
											? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
											: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}">
											{#if row.status === 'Done'}
												<CheckCircle2 class="w-3 h-3 text-emerald-400" />
											{:else}
												<Loader2 class="w-3 h-3 text-amber-400 animate-spin" />
											{/if}
											{row.status}
										</span>
									</td>

									<!-- Target Input -->
									<td class="px-4 py-3 text-right">
										<input
											type="text"
											value={row.target}
											class="w-14 text-right bg-transparent hover:bg-[#101114] border border-transparent hover:border-zinc-700 focus:border-[#EF233C] focus:bg-[#101114] rounded px-1.5 py-0.5 text-zinc-300 font-mono transition"
										/>
									</td>

									<!-- Limit Input -->
									<td class="px-4 py-3 text-right">
										<input
											type="text"
											value={row.limit}
											class="w-14 text-right bg-transparent hover:bg-[#101114] border border-transparent hover:border-zinc-700 focus:border-[#EF233C] focus:bg-[#101114] rounded px-1.5 py-0.5 text-zinc-300 font-mono transition"
										/>
									</td>

									<!-- Reviewer Select / Label -->
									<td class="px-4 py-3">
										{#if row.reviewer === 'Assign reviewer'}
											<select class="bg-[#101114] border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-400 focus:outline-none focus:border-[#EF233C] cursor-pointer">
												<option value="">Assign reviewer</option>
												<option value="Eddie Lake">Eddie Lake</option>
												<option value="Jamik Tashpulatov">Jamik Tashpulatov</option>
											</select>
										{:else}
											<span class="text-zinc-300">{row.reviewer}</span>
										{/if}
									</td>

									<!-- Actions Dropdown Trigger -->
									<td class="px-3 py-3 text-right">
										<button class="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition">
											<MoreVertical class="w-3.5 h-3.5" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Pagination Bar -->
				<div class="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-[#27272a] gap-4 select-none">
					<div class="text-xs text-zinc-400">
						{selectedIds.length} of {filteredItems.length} row(s) selected.
					</div>

					<div class="flex items-center gap-6">
						<div class="flex items-center gap-2">
							<span class="text-xs text-zinc-400">Rows per page</span>
							<select
								bind:value={pageSize}
								onchange={() => (currentPage = 0)}
								class="bg-[#101114] border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none"
							>
								<option value={10}>10</option>
								<option value={20}>20</option>
								<option value={30}>30</option>
							</select>
						</div>

						<span class="text-xs text-zinc-400">
							Page {currentPage + 1} of {totalPages}
						</span>

						<div class="flex items-center gap-1">
							<button
								onclick={() => (currentPage = 0)}
								disabled={currentPage === 0}
								class="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
							>
								<ChevronsLeft class="w-4 h-4" />
							</button>
							<button
								onclick={() => (currentPage = Math.max(0, currentPage - 1))}
								disabled={currentPage === 0}
								class="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
							>
								<ChevronLeft class="w-4 h-4" />
							</button>
							<button
								onclick={() => (currentPage = Math.min(totalPages - 1, currentPage + 1))}
								disabled={currentPage >= totalPages - 1}
								class="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
							>
								<ChevronRight class="w-4 h-4" />
							</button>
							<button
								onclick={() => (currentPage = totalPages - 1)}
								disabled={currentPage >= totalPages - 1}
								class="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
							>
								<ChevronsRight class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Other Tabs Placeholders -->
		<div class="px-4 lg:px-6">
			<div class="bg-[#18191D] border border-dashed border-[#27272a] rounded-xl p-12 text-center">
				<p class="text-sm text-zinc-400 font-medium">Viewing {currentTab} section documents.</p>
				<p class="text-xs text-zinc-500 mt-1">Ready for section item linking and audit history.</p>
			</div>
		</div>
	{/if}

	<!-- Right Drawer / Inspector Modal -->
	{#if selectedItem}
		<div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
			<div class="w-full max-w-md bg-[#18191D] border-l border-[#27272a] h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-right duration-200">
				<!-- Drawer Header -->
				<div class="flex items-start justify-between pb-4 border-b border-[#27272a]">
					<div>
						<h3 class="text-base font-bold text-white">{selectedItem.header}</h3>
						<p class="text-xs text-zinc-400 mt-0.5">Section Inspector & Metrics</p>
					</div>
					<button onclick={() => (selectedItem = null)} class="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
						<X class="w-4 h-4" />
					</button>
				</div>

				<!-- Drawer Body -->
				<div class="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
					<div class="p-4 rounded-lg bg-[#101114] border border-[#27272a]">
						<span class="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">Status Overview</span>
						<p class="text-xs text-zinc-300 mt-1">Trending up by 5.2% this period across active project deliverables.</p>
					</div>

					<div class="space-y-1.5">
						<label class="text-zinc-400 font-medium">Header Title</label>
						<input type="text" value={selectedItem.header} class="w-full bg-[#101114] border border-[#27272a] rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#EF233C]" />
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label class="text-zinc-400 font-medium">Type</label>
							<input type="text" value={selectedItem.type} class="w-full bg-[#101114] border border-[#27272a] rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#EF233C]" />
						</div>
						<div class="space-y-1.5">
							<label class="text-zinc-400 font-medium">Status</label>
							<input type="text" value={selectedItem.status} class="w-full bg-[#101114] border border-[#27272a] rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#EF233C]" />
						</div>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label class="text-zinc-400 font-medium">Target</label>
							<input type="text" value={selectedItem.target} class="w-full bg-[#101114] border border-[#27272a] rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#EF233C]" />
						</div>
						<div class="space-y-1.5">
							<label class="text-zinc-400 font-medium">Limit</label>
							<input type="text" value={selectedItem.limit} class="w-full bg-[#101114] border border-[#27272a] rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#EF233C]" />
						</div>
					</div>

					<div class="space-y-1.5">
						<label class="text-zinc-400 font-medium">Reviewer</label>
						<input type="text" value={selectedItem.reviewer} class="w-full bg-[#101114] border border-[#27272a] rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#EF233C]" />
					</div>
				</div>

				<!-- Drawer Footer -->
				<div class="pt-4 border-t border-[#27272a] flex items-center justify-end gap-2">
					<button onclick={() => (selectedItem = null)} class="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition">
						Done
					</button>
					<button onclick={() => (selectedItem = null)} class="px-4 py-2 rounded-lg bg-[#EF233C] hover:bg-[#d91d34] text-white font-medium transition">
						Save Changes
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

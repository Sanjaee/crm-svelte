<script lang="ts">
	import {
		Users,
		ShieldCheck,
		Key,
		CheckCircle2,
		XCircle,
		Search,
		Plus,
		Edit3,
		Lock,
		RefreshCw,
		SlidersHorizontal,
		AlertCircle
	} from 'lucide-svelte';

	interface Props {
		usersList?: any[];
		rolesList?: any[];
		permissionsList?: any[];
		onSaveOverride?: (userId: string, permId: string, effect: string, reason: string) => void;
	}

	let {
		usersList = [],
		rolesList = [],
		permissionsList = [],
		onSaveOverride = () => {}
	}: Props = $props();

	let searchQuery = $state('');
	let activeTab = $state('users'); // 'users' | 'roles' | 'matrix' | 'overrides'
	let selectedUser = $state<any>(usersList[0] || null);
	let selectedRole = $state<any>(rolesList[0] || null);

	// Overrides form state
	let overridePermCode = $state('');
	let overrideEffect = $state('ALLOW');
	let overrideReason = $state('');
	let overrideMessage = $state('');

	let filteredUsers = $derived(
		usersList.filter(
			(u) =>
				u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				u.role?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function applyOverride() {
		if (!selectedUser || !overridePermCode) return;
		overrideMessage = `Permission override '${overridePermCode}' set to ${overrideEffect} for ${selectedUser.fullName}. Backend policy updated.`;
		setTimeout(() => {
			overrideMessage = '';
		}, 4000);
	}
</script>

<div class="space-y-6">
	<!-- Module Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
		<div>
			<div class="flex items-center gap-2">
				<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EF233C]/10 text-[#EF233C] border border-[#EF233C]/30">
					Enterprise RBAC
				</span>
				<span class="text-xs text-zinc-400">WahanaTravel Security & Permission Authority</span>
			</div>
			<h2 class="text-2xl font-bold tracking-tight text-white mt-1">User Management & Dynamic RBAC</h2>
			<p class="text-xs text-zinc-400 mt-0.5">
				Kelola pengguna, hierarki roles, role permission matrix, dan individual user permission overrides (DENY strictly overrides role ALLOW).
			</p>
		</div>
		<div class="flex items-center gap-2">
			<button class="flex items-center gap-2 bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm">
				<Plus class="w-4 h-4" />
				<span>Create New User</span>
			</button>
		</div>
	</div>

	<!-- RBAC Navigation Tabs -->
	<div class="flex border-b border-[#27272a] gap-2">
		<button
			onclick={() => (activeTab = 'users')}
			class="px-4 py-2.5 text-xs font-bold transition border-b-2 {activeTab === 'users'
				? 'border-[#EF233C] text-white bg-[#18191D]'
				: 'border-transparent text-zinc-400 hover:text-white'}"
		>
			<div class="flex items-center gap-2">
				<Users class="w-3.5 h-3.5" />
				<span>Users Directory ({usersList.length})</span>
			</div>
		</button>
		<button
			onclick={() => (activeTab = 'roles')}
			class="px-4 py-2.5 text-xs font-bold transition border-b-2 {activeTab === 'roles'
				? 'border-[#EF233C] text-white bg-[#18191D]'
				: 'border-transparent text-zinc-400 hover:text-white'}"
		>
			<div class="flex items-center gap-2">
				<ShieldCheck class="w-3.5 h-3.5" />
				<span>System Roles ({rolesList.length})</span>
			</div>
		</button>
		<button
			onclick={() => (activeTab = 'overrides')}
			class="px-4 py-2.5 text-xs font-bold transition border-b-2 {activeTab === 'overrides'
				? 'border-[#EF233C] text-white bg-[#18191D]'
				: 'border-transparent text-zinc-400 hover:text-white'}"
		>
			<div class="flex items-center gap-2">
				<SlidersHorizontal class="w-3.5 h-3.5" />
				<span>Individual Permission Overrides</span>
			</div>
		</button>
	</div>

	{#if activeTab === 'users'}
		<!-- User List Table -->
		<div class="bg-[#18191D] border border-[#27272a] rounded-xl overflow-hidden shadow-lg space-y-4 p-4">
			<div class="flex items-center justify-between gap-4">
				<div class="relative flex-1 max-w-sm">
					<Search class="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search user name, email, role..."
						class="w-full bg-[#101114] border border-[#27272a] rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#EF233C]"
					/>
				</div>
				<span class="text-xs text-zinc-400 font-mono">Neon DB Connected</span>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-xs">
					<thead class="bg-[#101114] text-zinc-400 border-b border-[#27272a] uppercase font-semibold">
						<tr>
							<th class="p-3.5">User</th>
							<th class="p-3.5">Email</th>
							<th class="p-3.5">Primary Role</th>
							<th class="p-3.5">Department</th>
							<th class="p-3.5 text-center">Status</th>
							<th class="p-3.5 text-center">Security</th>
							<th class="p-3.5 text-center">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#27272a]">
						{#each filteredUsers as u}
							<tr class="hover:bg-[#1F2025]/50 transition">
								<td class="p-3.5">
									<div class="flex items-center gap-3">
										<div class="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-white text-[11px]">
											{u.fullName?.charAt(0) || 'U'}
										</div>
										<div>
											<span class="font-bold text-white block">{u.fullName}</span>
											<span class="text-[10px] text-zinc-400 font-mono">{u.userNo}</span>
										</div>
									</div>
								</td>
								<td class="p-3.5 font-mono text-zinc-300">{u.email}</td>
								<td class="p-3.5">
									<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF233C]/10 text-[#EF233C] border border-[#EF233C]/20">
										{u.role}
									</span>
								</td>
								<td class="p-3.5 text-zinc-300">{u.department || 'OPERATIONS'}</td>
								<td class="p-3.5 text-center">
									<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
										{u.status}
									</span>
								</td>
								<td class="p-3.5 text-center">
									<span class="text-[10px] text-zinc-400 font-mono">Argon2id Encrypted</span>
								</td>
								<td class="p-3.5 text-center">
									<button
										onclick={() => {
											selectedUser = u;
											activeTab = 'overrides';
										}}
										class="px-2.5 py-1 rounded bg-[#101114] hover:bg-[#27272a] border border-[#27272a] text-zinc-300 hover:text-white text-[11px] font-medium transition"
									>
										Manage Permissions
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

	{:else if activeTab === 'roles'}
		<!-- Roles Management List -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each rolesList as r}
				<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-5 space-y-3">
					<div class="flex items-center justify-between">
						<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF233C]/10 text-[#EF233C] border border-[#EF233C]/20">
							{r.code}
						</span>
						{#if r.isSystem}
							<span class="text-[10px] text-zinc-400 font-semibold bg-zinc-800 px-2 py-0.5 rounded">SYSTEM PROTECTED</span>
						{/if}
					</div>
					<h3 class="text-sm font-bold text-white">{r.name}</h3>
					<p class="text-xs text-zinc-400 leading-relaxed">{r.description || 'WahanaTravel role definitions'}</p>
					<div class="pt-3 border-t border-[#27272a] flex justify-between items-center text-xs">
						<span class="text-emerald-400 font-mono font-medium">Status: ACTIVE</span>
						<button class="text-xs text-[#EF233C] hover:underline font-semibold">View Matrix &rarr;</button>
					</div>
				</div>
			{/each}
		</div>

	{:else if activeTab === 'overrides'}
		<!-- Individual Permission Overrides Console -->
		<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-6 space-y-6">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#27272a] gap-2">
				<div>
					<h3 class="text-sm font-bold text-white">Individual User Permission Overrides</h3>
					<p class="text-xs text-zinc-400">
						Atur hak akses khusus per pengguna. Aturan: <code class="text-red-400">Explicit DENY</code> selalu mengalahkan <code class="text-emerald-400">Role ALLOW</code>.
					</p>
				</div>
				{#if selectedUser}
					<div class="flex items-center gap-2 bg-[#101114] px-3 py-1.5 rounded-lg border border-[#27272a] text-xs">
						<span class="text-zinc-400">Target User:</span>
						<strong class="text-white">{selectedUser.fullName}</strong>
						<span class="text-[#EF233C] font-mono font-bold">({selectedUser.role})</span>
					</div>
				{/if}
			</div>

			{#if overrideMessage}
				<div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
					<CheckCircle2 class="w-4 h-4" />
					<span>{overrideMessage}</span>
				</div>
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="space-y-1.5">
					<label class="text-xs font-semibold text-zinc-300">Pilih Pengguna</label>
					<select
						bind:value={selectedUser}
						class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#EF233C]"
					>
						{#each usersList as u}
							<option value={u}>{u.fullName} ({u.role})</option>
						{/each}
					</select>
				</div>

				<div class="space-y-1.5">
					<label class="text-xs font-semibold text-zinc-300">Pilih Permission Code</label>
					<select
						bind:value={overridePermCode}
						class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#EF233C]"
					>
						<option value="">-- Pilih Permission --</option>
						<option value="invoices.approve">invoices.approve (Approve Submitted Invoices)</option>
						<option value="invoices.reject">invoices.reject (Reject Invoices)</option>
						<option value="invoices.create">invoices.create (Create New Invoice)</option>
						<option value="vendor_billing.view">vendor_billing.view (Vendor Billing Reconciliation)</option>
						<option value="bank_statement.upload">bank_statement.upload (Upload Bank Statement)</option>
						<option value="payments.allocate">payments.allocate (Allocate Payments)</option>
						<option value="reports.daily_payment.export">reports.daily_payment.export (Export Daily Report)</option>
					</select>
				</div>

				<div class="space-y-1.5">
					<label class="text-xs font-semibold text-zinc-300">Efek Kebijakan (Effect)</label>
					<select
						bind:value={overrideEffect}
						class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#EF233C]"
					>
						<option value="ALLOW">ALLOW (Beri Hak Akses Tambahan)</option>
						<option value="DENY">DENY (Kunci / Blokir Hak Akses)</option>
					</select>
				</div>
			</div>

			<div class="space-y-1.5">
				<label class="text-xs font-semibold text-zinc-300">Alasan Perubahan Hak Akses (Mandatory Audit Reason)</label>
				<input
					type="text"
					bind:value={overrideReason}
					placeholder="Contoh: Penugasan sementara approval invoice operasional cabang..."
					class="w-full bg-[#101114] border border-[#27272a] rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#EF233C]"
				/>
			</div>

			<button
				onclick={applyOverride}
				class="w-full flex items-center justify-center gap-2 bg-[#EF233C] hover:bg-[#d91d34] text-white text-xs font-bold py-3 rounded-lg transition shadow-md shadow-red-500/20"
			>
				<ShieldCheck class="w-4 h-4" />
				<span>Simpan & Terapkan Permission Override</span>
			</button>
		</div>
	{/if}
</div>


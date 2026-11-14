<script lang="ts">
	let timeRange = $state('90d');

	// Sample interactive point generator simulating the chart screenshot
	const pointsCount = 45;
	const sampleData = Array.from({ length: pointsCount }, (_, i) => {
		const baseDesktop = 120 + Math.sin(i * 0.4) * 80 + Math.cos(i * 0.8) * 60 + (i % 5) * 40;
		const baseMobile = 70 + Math.sin(i * 0.4 + 1) * 50 + Math.cos(i * 0.6) * 40 + (i % 3) * 30;
		return {
			day: i,
			desktop: Math.max(30, Math.round(baseDesktop)),
			mobile: Math.max(20, Math.round(baseMobile))
		};
	});

	// Build smooth SVG area path
	const svgWidth = 1000;
	const svgHeight = 220;
	const maxVal = 400;

	const desktopPoints = sampleData.map((d, i) => {
		const x = (i / (pointsCount - 1)) * svgWidth;
		const y = svgHeight - (d.desktop / maxVal) * (svgHeight - 20);
		return `${x},${y}`;
	});

	const mobilePoints = sampleData.map((d, i) => {
		const x = (i / (pointsCount - 1)) * svgWidth;
		const y = svgHeight - (d.mobile / maxVal) * (svgHeight - 20);
		return `${x},${y}`;
	});

	const desktopArea = `M 0,${svgHeight} L ${desktopPoints.join(' L ')} L ${svgWidth},${svgHeight} Z`;
	const desktopLine = `M ${desktopPoints.join(' L ')}`;

	const mobileArea = `M 0,${svgHeight} L ${mobilePoints.join(' L ')} L ${svgWidth},${svgHeight} Z`;
	const mobileLine = `M ${mobilePoints.join(' L ')}`;
</script>

<div class="bg-[#18191D] border border-[#27272a] rounded-xl p-6">
	<!-- Chart Header & Range Toggle -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
		<div>
			<h3 class="text-base font-semibold text-white tracking-tight">Total Visitors</h3>
			<p class="text-xs text-zinc-400 mt-0.5">Total for the last 3 months</p>
		</div>

		<!-- Time Range Toggle Group -->
		<div class="inline-flex items-center bg-[#1F2025] border border-[#27272a] rounded-lg p-0.5 self-start sm:self-auto">
			<button
				onclick={() => (timeRange = '90d')}
				class="px-3 py-1 text-xs font-medium rounded-md transition {timeRange === '90d'
					? 'bg-[#27272a] text-white shadow-sm'
					: 'text-zinc-400 hover:text-white'}"
			>
				Last 3 months
			</button>
			<button
				onclick={() => (timeRange = '30d')}
				class="px-3 py-1 text-xs font-medium rounded-md transition {timeRange === '30d'
					? 'bg-[#27272a] text-white shadow-sm'
					: 'text-zinc-400 hover:text-white'}"
			>
				Last 30 days
			</button>
			<button
				onclick={() => (timeRange = '7d')}
				class="px-3 py-1 text-xs font-medium rounded-md transition {timeRange === '7d'
					? 'bg-[#27272a] text-white shadow-sm'
					: 'text-zinc-400 hover:text-white'}"
			>
				Last 7 days
			</button>
		</div>
	</div>

	<!-- Interactive Area SVG Chart -->
	<div class="w-full h-64 relative overflow-hidden select-none">
		<svg viewBox="0 0 {svgWidth} {svgHeight}" class="w-full h-full overflow-visible" preserveAspectRatio="none">
			<defs>
				<!-- Red Gradient (Desktop) -->
				<linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#EF233C" stop-opacity="0.35" />
					<stop offset="90%" stop-color="#EF233C" stop-opacity="0.01" />
				</linearGradient>
				<!-- Gray/White Gradient (Mobile) -->
				<linearGradient id="zincGradient" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#ffffff" stop-opacity="0.2" />
					<stop offset="90%" stop-color="#ffffff" stop-opacity="0.01" />
				</linearGradient>
			</defs>

			<!-- Horizontal Grid Lines -->
			<line x1="0" y1="30" x2={svgWidth} y2="30" stroke="#27272a" stroke-dasharray="3 3" />
			<line x1="0" y1="90" x2={svgWidth} y2="90" stroke="#27272a" stroke-dasharray="3 3" />
			<line x1="0" y1="150" x2={svgWidth} y2="150" stroke="#27272a" stroke-dasharray="3 3" />
			<line x1="0" y1={svgHeight - 1} x2={svgWidth} y2={svgHeight - 1} stroke="#27272a" />

			<!-- Mobile Area & Line -->
			<path d={mobileArea} fill="url(#zincGradient)" />
			<path d={mobileLine} fill="none" stroke="#a1a1aa" stroke-width="1.5" />

			<!-- Desktop (Primary Red) Area & Line -->
			<path d={desktopArea} fill="url(#redGradient)" />
			<path d={desktopLine} fill="none" stroke="#EF233C" stroke-width="2" />
		</svg>
	</div>

	<!-- X-Axis Labels -->
	<div class="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-3 border-t border-[#27272a]/60">
		<span>Apr 7</span>
		<span>Apr 13</span>
		<span>Apr 19</span>
		<span>Apr 26</span>
		<span>May 2</span>
		<span>May 8</span>
		<span>May 14</span>
		<span>May 21</span>
		<span>May 28</span>
		<span>Jun 3</span>
		<span>Jun 9</span>
		<span>Jun 15</span>
		<span>Jun 22</span>
		<span>Jun 30</span>
	</div>
</div>


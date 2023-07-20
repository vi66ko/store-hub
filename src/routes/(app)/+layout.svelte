<script lang="ts">
	//  Skeleton components
	import {
		AppShell,
		AppBar,
		AppRail,
		AppRailTile,
		AppRailAnchor,
		Modal
	} from '@skeletonlabs/skeleton';
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	// Website components
	import ManageNavigation from '$lib/components/Navigations/Manage.svelte';

	import GoHome from 'svelte-icons/go/GoHome.svelte';
	import GiGearHammer from 'svelte-icons/gi/GiGearHammer.svelte';
	import GiAbstract089 from 'svelte-icons/gi/GiAbstract089.svelte';
	import GiAbacus from 'svelte-icons/gi/GiAbacus.svelte';

	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let currentTile: number = 0;

	enum selecteAppRail {
		Home,
		Manage,
		Setup,
		Reporting
	}

	function drawerOpen() {
		drawerStore.open();
	}
</script>

<AppShell slotSidebarLeft="flex bg-surface-500/50">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button on:click={drawerOpen} class="lg:hidden btn btn-sm mr-4">
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<strong class="text-xl uppercase">Store Hub</strong>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://discord.gg/EXqV7W8MtY"
					target="_blank"
					rel="noreferrer"
				>
					Discord
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://twitter.com/SkeletonUI"
					target="_blank"
					rel="noreferrer"
				>
					Twitter
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/skeletonlabs/skeleton"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<AppRail width="w-16">
			<svelte:fragment slot="lead">
				<a href="/home" on:click={() => (currentTile = 0)}>
					<AppRailTile
						bind:group={currentTile}
						name="tile-1"
						value={0}
						className="bg-secondary-500"
					>
						<svelte:fragment slot="lead">
							<div class="sidebar-icons">
								<GoHome />
							</div>
						</svelte:fragment>
						<span>Home</span>
					</AppRailTile>
				</a>
				<AppRailTile bind:group={currentTile} name="tile-2" value={1}>
					<svelte:fragment slot="lead">
						<div class="sidebar-icons">
							<GiAbstract089 />
						</div>
					</svelte:fragment>
					<span>Manage</span>
				</AppRailTile>
				<AppRailTile bind:group={currentTile} name="tile-3" value={2}>
					<svelte:fragment slot="lead">
						<div class="sidebar-icons">
							<GiGearHammer />
						</div>
					</svelte:fragment>
					<span>Setup</span>
				</AppRailTile>
				<AppRailTile bind:group={currentTile} name="tile-4" value={3}>
					<svelte:fragment slot="lead">
						<div class="sidebar-icons">
							<GiAbacus />
						</div>
					</svelte:fragment>
					<span>Reporting </span>
				</AppRailTile>
			</svelte:fragment>
			<!-- --- -->
			<svelte:fragment slot="trail">
				<AppRailAnchor href="/" title="Account">(icon)</AppRailAnchor>
			</svelte:fragment>
		</AppRail>

		<Drawer>
			<h2 class="p-4">Navigation</h2>
			<hr />
			<ManageNavigation />
		</Drawer>
		{#if currentTile === selecteAppRail.Manage}
			<ManageNavigation />
		{/if}
	</svelte:fragment>

	<main class="px-3 py-1">
		<slot />
	</main>
</AppShell>
<Modal />

<style>
	.sidebar-icons {
		width: 1.9rem;
		margin: auto;
	}
</style>

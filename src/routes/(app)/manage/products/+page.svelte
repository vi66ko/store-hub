<script lang="ts">
	import { Autocomplete, popup, modalStore } from '@skeletonlabs/skeleton';

	import MdSearch from 'svelte-icons/md/MdSearch.svelte';
	import FaRegEdit from 'svelte-icons/fa/FaRegEdit.svelte';

	import type { PageData } from './$types';
	import type { AutocompleteOption, PopupSettings, ModalSettings } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import Edith from './Edith.svelte';

	export let data: PageData;
	let inputPopup: string = '';
	let isDeleteBtnDisabled = false;
	let edith = false;
	// $: console.log(data);

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom'
	};

	const flavorOptions: AutocompleteOption[] = [
		{ label: 'Vanilla', value: 'vanilla', keywords: 'plain, basic', meta: { healthy: false } },
		{ label: 'Chocolate', value: 'chocolate', keywords: 'dark, white', meta: { healthy: false } },
		{ label: 'Strawberry', value: 'strawberry', keywords: 'fruit', meta: { healthy: true } },
		{
			label: 'Neapolitan',
			value: 'neapolitan',
			keywords: 'mix, strawberry, chocolate, vanilla',
			meta: { healthy: false }
		},
		{ label: 'Pineapple', value: 'pineapple', keywords: 'fruit', meta: { healthy: true } },
		{ label: 'Peach', value: 'peach', keywords: 'fruit', meta: { healthy: true } }
	];

	function onPopupSelect(event: any): void {
		inputPopup = event.detail.label;
	}

	const delModal: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: 'Are you sure you want to delete it?',
		response: (r: boolean) => r
	};

	modalStore.close();
	$: console.log('modalStore');
	$: console.log($modalStore[0]);
</script>

<form method="POST" class="py-4 relative">
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
		<div class=" w-14 input-group-shim">
			<MdSearch />
		</div>
		<input
			type="search"
			name="autocomplete-search"
			bind:value={inputPopup}
			placeholder="Search..."
			use:popup={popupSettings}
			class="input autocomplete px-4 py-2"
		/>
		<button class="variant-filled-secondary">Search</button>
		<!-- <button class="variant-filled-secondary">Submit</button> -->
	</div>

	<div
		data-popup="popupAutocomplete"
		class="card w-full max-h-48 py-4 overflow-y-auto border border-primary-500 top-[-100px]"
		tabindex="-1"
	>
		<Autocomplete bind:input={inputPopup} options={flavorOptions} on:selection={onPopupSelect} />
	</div>
</form>

<!-- <button type="button" class="btn variant-ringed-success">
	<span>(icon)</span>
	<span>Button</span>
</button> -->
<div class="table-container flex justify-center">
	{#if edith}
		<Edith on:click={() => (edith = false)} />
	{:else}
		<table class="table table-hover">
			<thead class="tracking-wider">
				<tr>
					<th />
					<th>Position</th>
					<th>Name</th>
					<th>Symbol</th>
					<th>weight</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#each data.sourceData as row, i}
					<tr>
						<td class="w-48">
							<button
								type="button"
								class="btn variant-ringed-success"
								on:click={() => (edith = true)}
							>
								<span class="w-4"><FaRegEdit /></span>

								<span class="hidden md:inline font-light"> edith </span>
							</button>
						</td>
						<td>{row.position}</td>
						<td>{row.name}</td>
						<td>{row.symbol}</td>
						<td>{row.weight}</td>
						<td class="text-right">
							<form
								method="POST"
								action="?/delete"
								use:enhance={async () => {
									isDeleteBtnDisabled = true;
									console.log('beffore');
									console.log(modalStore.trigger(delModal));

									const confirmation = $modalStore[0]?.response();
									console.log('After');

									return async ({ update }) => {
										await update();

										isDeleteBtnDisabled = false;
									};
								}}
							>
								<input type="hidden" name="name" value={row.name} />
								<button class="btn variant-ringed-error" disabled={isDeleteBtnDisabled}>
									<span>X</span>
									<span class="hidden md:inline font-light">delete</span>
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<!-- <tr>
				<th colspan="3">Calculated Total Weight</th>
				<td>2002</td>
			</tr> -->
			</tfoot>
		</table>
	{/if}
</div>

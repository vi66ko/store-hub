<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { Autocomplete, popup, modalStore } from '@skeletonlabs/skeleton';
	import { spanWrap, toast } from '$lib/gadgetBag';

	import type { ActionData, PageData } from './$types';
	import type { AutocompleteOption, PopupSettings, ModalSettings } from '@skeletonlabs/skeleton';

	import MdSearch from 'svelte-icons/md/MdSearch.svelte';
	import FaRegEdit from 'svelte-icons/fa/FaRegEdit.svelte';
	import Edith from './Edith.svelte';

	export let data: PageData;
	export let form: ActionData;
	let inputPopup: string = '';
	let isDeleteBtnDisabled = false;
	let edith = false;
	let endPoint: string;
	let title: string;
	let selectedProduct: string | number = '';
	// $: console.log(data);

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom'
	};

	let autocompleteOption: AutocompleteOption[];
	onMount(() => {
		autocompleteOption = data.products.map((product) => {
			return {
				label: product.name
			};
		});
	});

	function onPopupSelect(event: any): void {
		inputPopup = event.detail.label;
	}

	function delFun(value: string): Promise<boolean> {
		return new Promise((resolve) => {
			const modal: ModalSettings = {
				type: 'confirm',
				title: 'Delete Confirmation',
				body: `You are about to DELETE product with name ${spanWrap(
					value,
					'ml-1 font-bold text-warning-500'
				)}.<br/>
				Are you sure?`,
				response: (r) => resolve(r)
			};
			modalStore.trigger(modal);
		});
	}

	function sortByLetters() {
		/**
		 * - True = ascendingly;
		 * - False = descendingly
		 * @type {boolean}
		 */
		let direction: boolean = true;
		return function (event: MouseEvent) {
			const sortBy = (event.target as HTMLButtonElement).dataset.value;
			console.log(data.products);

			data.products = data.products.sort((a, b) => {
				// What exactly is going on here
				// Why does not work properly
				// Is the ternary operator?
				let valueA = direction ? a[sortBy].toUpperCase() : b[sortBy].toUpperCase();
				let valueB = direction ? b[sortBy].toUpperCase() : a[sortBy].toUpperCase();
				// let valueA = b[sortBy].toUpperCase();
				// let valueB = a[sortBy].toUpperCase();

				if (valueA < valueB) {
					return -1;
				}
				if (valueA > valueB) {
					return 1;
				}

				return 0;
			});
			direction = !direction;

			console.dir(sortBy);
		};
	}

	function sortByNumbers() {
		/**
		 * 	- True = ascendingly;
		 *  - False = descendingly.
		 * @type {boolean}
		 */
		let direction: boolean = true;

		return function (event: MouseEvent) {
			const sortBy = (event.target as HTMLButtonElement).dataset.value;
			console.log(sortBy);

			data.products = data.products.sort((a, b) => {
				if (direction) {
					return a[sortBy] - b[sortBy];
				}

				return b[sortBy] - a[sortBy];
			});

			direction = !direction;
		};
	}
	// $: console.log(data);

	$: if (!form?.success && form?.message) {
		toast.warning(form.message);
	}
	$: if (form?.success) {
		toast.success(form.message);
	}
</script>

{#if edith}
	<Edith
		on:click={() => {
			selectedProduct = '';
			edith = false;
		}}
		{title}
		{endPoint}
		product={data.products[selectedProduct]}
		products={data.products}
		brands={data.brands}
		categories={data.categories}
	/>
{:else}
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
			<Autocomplete
				bind:input={inputPopup}
				options={autocompleteOption}
				on:selection={onPopupSelect}
			/>
		</div>
	</form>
	<div class="py-4 text-center">
		<button
			type="button"
			on:click={() => {
				endPoint = 'add';
				title = 'Adding new product';
				edith = true;
			}}
			class="w-96 h-[42px] btn variant-filled-secondary"
		>
			<span>+</span>
			<span>add new product</span>
		</button>
	</div>
	<div class="py-4 table-container flex justify-center">
		<table class="table table-hover">
			<thead class="tracking-wider">
				<tr>
					<th class="text-center">
						<button data-value="tableId" on:click={sortByNumbers()}> Id </button>
					</th>
					<th>
						<button data-value="name" on:click={sortByLetters()}> Name </button>
					</th>
					<th>
						<button data-value="description" on:click={sortByLetters()}> Description </button>
					</th>
					<th>
						<button data-value="price" on:click={sortByNumbers()}>Price</button>
					</th>
					<th>
						<button data-value="barcode" on:click={sortByNumbers()}>Barcode</button>
					</th>
					<th>
						<button data-value="category" on:click={sortByLetters()}>Category</button>
					</th>
					<th>
						<button data-value="brand" on:click={sortByLetters()}>Brand</button>
					</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#if data?.products.length === 0}
					<tr>
						<td colspan="8">
							<p class="px-2 py-4 text-center dark:bg-surface-800">
								There is not any products records. Feel free to add.
							</p>
						</td>
					</tr>
				{:else}
					{#each data?.products as product, i}
						<tr>
							<td class="text-center">{product.tableId}</td>
							<td>{product.name}</td>
							<td>{product.description}</td>
							<td>{product.price.toFixed(2)}</td>
							<td>{product.barcode}</td>
							<td>{product.category}</td>
							<td>{product.brand}</td>
							<td class="flex justify-end">
								<div>
									<button
										type="button"
										on:click={() => {
											endPoint = 'edit';
											title = 'Editing';
											edith = true;
											selectedProduct = i;
										}}
										class="btn variant-ringed-success"
									>
										<span class="w-4"><FaRegEdit /></span>
										<span class="hidden md:inline font-light"> edith </span>
									</button>
								</div>
								<form
									method="POST"
									action="?/delete"
									use:enhance={async ({ cancel }) => {
										isDeleteBtnDisabled = true;
										const confirmation = await delFun(product.name);
										if (!confirmation) {
											isDeleteBtnDisabled = false;
											cancel();
										}

										return async ({ update }) => {
											await update();
											isDeleteBtnDisabled = false;
										};
									}}
									class="ml-4"
								>
									<input type="hidden" name="name" value={product.name} />
									<button class="btn variant-ringed-error" disabled={isDeleteBtnDisabled}>
										<span>X</span>
										<span class="hidden md:inline font-light">delete</span>
									</button>
								</form>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
			<tfoot>
				<!-- <tr>
				<th colspan="3">Calculated Total Weight</th>
				<td>2002</td>
			</tr> -->
			</tfoot>
		</table>
	</div>
{/if}

<style>
</style>

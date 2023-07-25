<script lang="ts">
	import { enhance } from '$app/forms';
	import { spanWrap, toast } from '$lib/gadgetBag';
	import { modalStore } from '@skeletonlabs/skeleton';

	import type { ModalSettings } from '@skeletonlabs/skeleton';

	export let endPoint: string;
	export let title: string;
	export let product = {
		rowid: '',
		name: '',
		description: '',
		price: '',
		barcode: '',
		category: '',
		brand: ''
	};

	export let products = [product];
	export let brands: Array<string> = [];
	export let categories: Array<string> = [];

	let closingBtn: HTMLButtonElement;

	function addBrand() {
		const modal: ModalSettings = {
			type: 'prompt',
			title: 'Add a new brand',
			body: '',
			valueAttr: { type: 'text', required: true, class: 'input variant-form-material' },
			response: async (value) => {
				const formData = new FormData();

				if (value) {
					formData.append('name', value);

					const request = await fetch('brands?/add', {
						method: 'POST',
						body: formData
					});
					const response = await request.json();
					const data = JSON.parse(response.data);

					if (response.type === 'success') {
						toast.success(data[2]);
						brands = [...brands, { name: value }];
					} else {
						toast.warning(data[2]);
					}
				}
			}
		};
		modalStore.trigger(modal);
	}
	function addCategory() {
		const modal: ModalSettings = {
			type: 'prompt',
			title: 'Add a new category',
			body: '',
			valueAttr: { type: 'text', required: true, class: 'input variant-form-material' },
			response: async (value) => {
				const formData = new FormData();

				if (value) {
					formData.append('name', value);

					const request = await fetch('categories?/add', {
						method: 'POST',
						body: formData
					});
					const response = await request.json();
					const data = JSON.parse(response.data);

					if (response.type === 'success') {
						toast.success(data[2]);
						categories = [...categories, { name: value }];
					} else {
						toast.warning(data[2]);
					}
				}
			}
		};
		modalStore.trigger(modal);
	}
	$: {
		// console.log('[[[[[[[[[[ Products ]]]]]]]]]]');
		// console.log({ product });
	}
</script>

<section class="mt-4 p-2 mx-auto w-full max-w-2xl">
	<header class="flex sticky top-0 z-10 p-2 bg-surface-200 dark:bg-surface-700">
		<div class="w-full text">
			<h2 class="h-full pl-2 pt-2 font-bold text-center tracking-wider">{title}:</h2>
		</div>
		<button on:click bind:this={closingBtn} class="btn variant-ringed-surface">X</button>
	</header>
	<form
		method="POST"
		action="?/{endPoint}"
		use:enhance={({ formData, cancel }) => {
			const id = Number(formData.get('id'));
			const name = formData.get('name');

			const doesExist = products.some(
				(product) => product.rowid !== id && product.name.toLowerCase() === name.toLowerCase()
			);

			if (doesExist) {
				toast.warning(`${spanWrap(name)} already exist.`);
				cancel();
				return;
			}

			return ({ update, result }) => {
				update();
				if (result.status === 200 && endPoint === 'edit') {
					closingBtn.click();
				}
			};
		}}
		class="h-[46rem] flex flex-col justify-between pt-10"
	>
		<input type="hidden" name="id" value={product?.rowid || ''} />
		<label class="label">
			<span>Name:</span>
			<input
				type="text"
				name="name"
				id="name"
				autofocus
				value={product?.name || ''}
				required
				class="input variant-form-material"
			/>
		</label>

		<label class="label">
			<span>Description</span>
			<textarea
				name="description"
				rows="3"
				placeholder="Enter a short description for the product."
				value={product?.description || ''}
				class="textarea"
			/>
		</label>
		<label class="label">
			<span>Price:</span>
			<input
				type="number"
				name="price"
				step="0.01"
				value={product?.price || ''}
				required
				class="input variant-form-material"
			/>
		</label>
		<label class="label">
			<span>Barcode:</span>
			<input
				type="text"
				name="barcode"
				value={product?.barcode || ''}
				class="input variant-form-material"
			/>
		</label>
		<div class="flex items-end">
			<label class="label w-full pr-4">
				<span>Category</span>
				<select name="category" class="select variant-form-material">
					<option value="Others">Others</option>
					{#each categories as category}
						{#if category.name !== 'Others'}
							{#if category.name === product?.category}
								<option value={category.name} selected>{category.name}</option>
							{:else}
								<option value={category.name}>{category?.name}</option>
							{/if}
						{/if}
					{/each}
				</select>
			</label>
			<button
				type="button"
				on:click={addCategory}
				class="h-[41px] pb-3 btn variant-filled-success text-2xl">+</button
			>
		</div>
		<div class="flex items-end">
			<label class="label w-full pr-4">
				<span>Brand</span>
				<select name="brand" class="select variant-form-material">
					<option value="none">none</option>
					<!-- {#key brands} -->
					{#each brands as brand}
						{#if brand.name !== 'none'}
							{#if brand.name === product?.brand}
								<option value={brand.name} selected>{brand.name}</option>
							{:else}
								<option value={brand.name}>{brand.name}</option>
							{/if}
						{/if}
					{/each}
					<!-- {/key} -->
				</select>
			</label>
			<button
				type="button"
				on:click={addBrand}
				class="h-[41px] pb-3 btn variant-filled-success text-2xl">+</button
			>
		</div>
		<div class="py-4">
			<button type="submit" class="w-full btn variant-filled-secondary">Submit</button>
		</div>
	</form>
</section>

<style>
	h2 {
		vertical-align: bottom;
	}
</style>

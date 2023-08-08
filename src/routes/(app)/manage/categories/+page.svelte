<script lang="ts">
	import { enhance } from '$app/forms';

	import FaRegEdit from 'svelte-icons/fa/FaRegEdit.svelte';
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';

	import { modalStore } from '@skeletonlabs/skeleton';

	import { spanWrap, toast } from '$lib/gadgetBag';

	import type { PageData, ActionData } from './$types';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	export let data: PageData;
	export let form: ActionData;

	/**
	 *
	 * @param value
	 * @returns {Promise<string>} An empty string or “value” string.
	 */
	function editFun(value: string): Promise<string | false> {
		return new Promise((resolve) => {
			const modal: ModalSettings = {
				type: 'prompt',
				title: 'Edit',
				body: '',
				value: value,
				valueAttr: { type: 'text', required: true, class: 'input variant-form-material' },
				response: (r) => resolve(r)
			};
			modalStore.trigger(modal);
		});
	}
	function delFun(value: string): Promise<boolean> {
		return new Promise((resolve) => {
			const modal: ModalSettings = {
				type: 'confirm',
				title: 'Confirm deletion',
				body: `You are about to DELETE ${spanWrap(value, 'ml-1 font-bold text-warning-500')}.<br/>
				Are you sure?`,
				response: (r) => resolve(r)
			};
			modalStore.trigger(modal);
		});
	}

	$: if (!form?.success && form?.message) {
		toast.warning(form.message);
	}
	$: if (form?.success) {
		toast.success(form.message);
	}
</script>

<form
	method="POST"
	action="?/add"
	use:enhance
	class="w-[36rem] mx-auto flex items-end justify-between py-4"
>
	<label class="label">
		<input
			type="text"
			placeholder="Category name"
			name="name"
			required
			autofocus
			class="w-96 input variant-form-material"
		/>
	</label>
	<button class="h-[42px] btn variant-filled-secondary">+ add new category</button>
</form>

<div class="h-96 overflow-y-auto mt-8 table-container">
	<header class="flex sticky top-0 z-30 py-4 px-3 dark:bg-surface-700 font-bold">
		<h3 class="mr-6">Position</h3>
		<h3>Name</h3>
	</header>
	{#if data?.categories.length === 0}
		<p class="px-2 py-4 text-center dark:bg-surface-800">
			There is not any category records. Feel free to add.
		</p>
	{:else}
		<table class="table table-hover rounded-t-none">
			<!-- I do swap the table header with separate so I can make it stick to the top  -->
			<!-- <thead>
			<tr class="sticky top-0">
				<th>Position</th>
				<th>Name</th>
				<th />
			</tr>
		</thead> -->
			<tbody>
				{#each data.categories as category, i}
					<tr>
						<td class="w-[5.25rem] text-center">{i + 1}</td>
						<td>
							{category.name}
						</td>
						<td class="flex justify-end">
							<form
								method="POST"
								action="?/edit"
								use:enhance={async ({ formData, cancel }) => {
									const newCategoryName = await editFun(category.name);

									if (!newCategoryName) {
										cancel();
										return;
									}

									if (newCategoryName.length === 0) {
										toast.warning('The field should not be empty.');
										cancel();
										return;
									}

									const doesExist = data.categories.some(
										(category) => category.name.toLowerCase() === newCategoryName.toLowerCase()
									);

									if (doesExist) {
										toast.warning(`${spanWrap(newCategoryName)} already exist.`);
										cancel();
										return;
									}

									formData.set('newCategoryName', newCategoryName);

									return ({ update }) => {
										update();
									};
								}}
								class="mr-4"
							>
								<input type="hidden" name="categoryName" value={category.name} />
								<button class="btn variant-ringed-success">
									<span class="w-4"><FaRegEdit /></span>
									<span class="hidden md:inline font-light"> edit </span>
								</button>
							</form>
							<form
								method="POST"
								action="?/delete"
								use:enhance={async ({ submitter, formData, cancel }) => {
									submitter.disabled = true;
									const categoryName = formData.get('name');
									const confirmation = await delFun(categoryName);

									if (!confirmation) {
										cancel();
										submitter.disabled = false;
										return;
									}

									return ({ update }) => {
										update();
										submitter.disabled = false;
									};
								}}
							>
								<input type="hidden" name="name" value={category.name} />
								<button class="btn variant-ringed-error">
									<div class="w-4"><MdDelete /></div>
									<span class="hidden md:inline font-light">delete</span>
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<!-- <th colspan="3">Calculated Total Weight</th> -->
					<!-- <td>{totalWeight}</td> -->
				</tr>
			</tfoot>
		</table>
	{/if}
</div>

<style>
	td {
		padding: 0.5rem !important;
		vertical-align: baseline !important;
	}
</style>

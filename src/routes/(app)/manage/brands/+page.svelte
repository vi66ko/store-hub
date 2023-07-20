<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	$: console.log(data);
	$: console.log(form);
</script>

<!-- Responsive Container (recommended) -->

<form
	method="POST"
	action="?/add"
	use:enhance
	class="w-[26rem] mx-auto flex items-end justify-between py-4"
>
	<label class="label">
		<input
			type="text"
			placeholder="Brand name"
			name="name"
			required
			class="input variant-form-material"
		/>
	</label>
	<button class="h-11 btn variant-filled-secondary">+ add new brand</button>
</form>
{#if form?.existMessage}
	<p>{form.existMessage}</p>
{/if}

<div class="mt-8 table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Position</th>
				<th>Name</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each data.brands as row, i}
				<tr>
					<td class="w-16">{i + 1}</td>
					<td>
						{row.name}
					</td>
					<td />
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
</div>

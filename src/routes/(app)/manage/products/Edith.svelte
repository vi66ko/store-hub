<section class="w-full max-w-2xl">
	<header class=" flex p-2 bg-surface-200 dark:bg-surface-700">
		<div class="w-full text">
			<h2 class="h-full pl-2 pt-2 font-bold tracking-wider">Editing:</h2>
		</div>
		<button on:click class="btn variant-ringed-surface">X</button>
	</header>
	<form action="?/edith" class="h-[36rem] flex flex-col justify-between pt-10">
		<label class="label">
			<span>Name:</span>
			<input type="text" name="name" id="name" class="input variant-form-material" />
		</label>
		<label class="label">
			<span>Price:</span>
			<input type="number" step="0.01" name="price" class="input variant-form-material" />
		</label>
		<label class="label">
			<span>Barcode:</span>
			<input type="number" name="barcode" class="input variant-form-material" />
		</label>
		<!-- the brand can be drop down -->
		<label class="label">
			<span>Brand:</span>
			<input type="text" name="brand" class="input variant-form-material" />
		</label>

		<label class="label">
			<span>Group</span>
			<select class="select variant-form-material">
				<option value="1">Option 1</option>
				<option value="2">Option 2</option>
				<option value="3">Option 3</option>
				<option value="4">Option 4</option>
				<option value="5">Option 5</option>
			</select>
		</label>
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

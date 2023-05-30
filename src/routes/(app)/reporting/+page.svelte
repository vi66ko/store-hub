<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<form method="POST" action="?/login" use:enhance class="mr-6">
		<label class="label">
			<span>Name</span>
			<input class="input px-2 py-1" type="text" placeholder="Input" name="username" />
		</label>
		<input class="w-full mt-2 p-2 bg-primary-active-token" type="submit" value="Жегааа" />
	</form>

	<div class="space-y-5">
		<h1 class="h1">Let's get cracking bones!</h1>
		<p>Start by exploring:</p>
		<ul>
			<li>
				<code class="code">/src/routes/+layout.svelte</code> - barebones layout, the CSS import order
				is critical!
			</li>
			<li>
				<code class="code">/src/app.postcss</code> - minimal css to make the page full screen, may not
				be relevant for your project
			</li>
			<li>
				<code class="code">/src/routes/+page.svelte</code> - this page, you can replace the contents
			</li>
		</ul>
	</div>
</div>

<style>
</style>

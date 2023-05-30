<script lang="ts">
	import type { PageData } from './$types';

	import { TabGroup, Tab, focusTrap } from '@skeletonlabs/skeleton';
	export let data: PageData;

	// states
	let tabSet: number = 0;
	let isFocused: boolean = true;
</script>

<div class="h-screen grid place-items-center">
	<div class="w-64 bg-surface-700/50">
		<TabGroup>
			<Tab bind:group={tabSet} name="singIn" value={0}>Sign in:</Tab>
			<Tab bind:group={tabSet} name="signUp" value={1}>Sign up</Tab>
		</TabGroup>
		{#if tabSet === 0}
			<form
				method="POST"
				action="?login"
				use:focusTrap={isFocused && tabSet === 0}
				class="h-72 flex flex-col justify-between"
			>
				<div class="mt-6">
					<input type="text" name="username" id="username" placeholder="Username" class="input" />
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Password"
						class="input"
					/>
				</div>

				<button class="btn bg-gradient-to-br variant-gradient-secondary-primary rounded-none"
					>Login</button
				>
			</form>
		{/if}
		{#if tabSet === 1}
			<form
				method="POST"
				action="?signup"
				use:focusTrap={isFocused && tabSet === 1}
				class="h-72 flex flex-col justify-between"
			>
				<div class="mt-6">
					<input type="text" name="username" placeholder="Username" class="input mt-4" />
					<input type="password" name="password" placeholder="Password" class="input" />
					<input
						type="password"
						name="passwordConfirmation"
						placeholder="Confirm password"
						class="input"
					/>
				</div>

				<button class="btn bg-gradient-to-br variant-gradient-secondary-primary rounded-none"
					>Sign Up</button
				>
			</form>
		{/if}
	</div>
</div>

<style>
	input {
		font-family: 'Courier New', Courier, monospace;
		/* box-sizing: border-box; */
		padding: 0.5rem 0.7rem;
		margin-top: 10px;
		border-radius: 0;
		border: none;
		border-bottom: 3px solid gray;
		outline: none;
	}

	input:focus {
		border-bottom-style: solid;
		border-bottom-width: 3px;

		/* border-image: linear-gradient(to right, #0ea5e9, #4f46e5) 1.5; */
	}
</style>

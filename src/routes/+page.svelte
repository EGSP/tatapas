<script lang="ts">
	import Column from '$lib/components/structure/Column.svelte';
	import Row from '$lib/components/structure/Row.svelte';
	import { Button, InlineNotification, TextInput, Tile } from 'carbon-components-svelte';
	import { derived, writable } from 'svelte/store';
	import type { Result } from 'ts-results-es';
	import type { PageData, PageServerData } from './$types';
	import { onMount } from 'svelte';
	import { Logbox, logger, print_logbox } from '$lib/code/utilities/logging';

	import { user_login, user_fetch, user_store, user_register } from '$lib/code/stores/user';
	import { is_ok_fetch, type FetchBad, type FetchOk } from '$lib/code/db/types';
	import LoginPort from '$lib/components/viewports/LoginPort.svelte';
	import Plane from '$lib/components/structure/Plane.svelte';

	let name = writable<string | null>(null);
	let password = writable<string | null>(null);

	let is_valid_login_input = derived([name, password], ([$name, $password]) => {
		return $name != null && $name != '' && $password != null && $password != '';
	});

	async function try_fetch_user() {
		const logbox = new Logbox();
		const user = await user_fetch(logbox);

		if (user == null) {
			logbox.print();
			return;
		}

		user_store.logged_in(user);
		logbox.plog(`User: name: ${$user_store!.name}, user role: ${$user_store!.role}`);
		logbox.print();
	}

	async function try_login_user() {
		const logbox = new Logbox();
		logbox.plog(`User input: name: ${$name}, password: ${$password}`);

		const user = await user_login(logbox, $name!, $password!);
		if (user == null) {
			logbox.print();
			return;
		}

		user_store.logged_in(user);
		logbox.plog(`User logged in : name: ${$user_store!.name}, user role: ${$user_store!.role}`);
		logbox.print();
	}

	async function try_register_user() {
		const logbox = new Logbox();
		logbox.plog(`User input: name: ${$name}, password: ${$password}`);

		const user = await user_register(logbox, $name!, $password!);
		if (user == null) {
			logbox.print();
			return;
		}

		user_store.logged_in(user);
		logbox.plog(`User registered : name: ${$user_store!.name}, user role: ${$user_store!.role}`);
		logbox.print();
	}

	onMount(async () => {
		await try_fetch_user();
	});
</script>


<Plane>
	<LoginPort />
</Plane>


<div style="display:none">
	<Tile>
		<h1>Welcome to SvelteKit</h1>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

		<Column gap={1}>
			<TextInput bind:value={$name} placeholder="Enter your new name..." />
			<TextInput bind:value={$password} placeholder="Enter your new password..." />

			{#if !$is_valid_login_input}
				<InlineNotification
					hideCloseButton
					kind="info"
					title="Fill credentials:"
					subtitle="Enter your name and password to log in or sign up"
				/>
			{/if}
			<Row>
				<Button disabled={!$is_valid_login_input} on:click={try_register_user} kind="secondary"
					>Sign Up</Button
				>
				<Button disabled={!$is_valid_login_input} on:click={try_login_user} kind="primary"
					>Log In</Button
				>
			</Row>
		</Column>
	</Tile>

	<Tile>
		<h2>Login data</h2>
		{#if $user_store != null}
			<p>User name: {$user_store.name}</p>
			<p>User role: {$user_store.role}</p>
		{:else}
			<p>user: null</p>
		{/if}
	</Tile>
</div>

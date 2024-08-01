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
	import LoginPort from '$lib/components/viewports/LoginPort.svelte';
	import Plane from '$lib/components/structure/Plane.svelte';
	import Header from '$lib/components/elements/header/Header.svelte';
	import { debug_store } from '$lib/code/stores/debug';
	import VerticalLine from '$lib/components/structure/VerticalLine.svelte';

	debug_store.set(false);

	let name = writable<string | null>(null);
	let password = writable<string | null>(null);

	let is_valid_login_input = derived([name, password], ([$name, $password]) => {
		return $name != null && $name != '' && $password != null && $password != '';
	});

	async function try_fetch_user() {
		const logbox = new Logbox();
		const result = await user_fetch(logbox);

		if (result.value == null) {
			for(const message of result.messages) {
				logbox.plog(`${message.kind} ${message.title}${message.subtitle}`);
			}
			logbox.print();
			return;
		}

		user_store.logged_in(result.value);
		logbox.plog(`User: name: ${$user_store!.name}, user role: ${$user_store!.role}`);
		logbox.print();
	}
	
	onMount(async () => {
		await try_fetch_user();
	});
</script>

<Plane>
	<Header>
		<h3>tatapas</h3>
		<VerticalLine />
		{#if $user_store}
			<div>User: {$user_store.name}</div>
		{:else}
			<div>You are not logged in</div>
		{/if}
	</Header>
	<LoginPort />
</Plane>

<!-- <div style="display:none">
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
</div> -->

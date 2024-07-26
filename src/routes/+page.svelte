<script lang="ts">
	import Column from '$lib/components/structure/Column.svelte';
	import Row from '$lib/components/structure/Row.svelte';
	import { Button, InlineNotification, TextInput, Tile } from 'carbon-components-svelte';
	import { derived, writable } from 'svelte/store';
	import type { Result } from 'ts-results-es';
	import type { PageData, PageServerData } from './$types';
	import { onMount } from 'svelte';
	import { logger } from '$lib/code/utilities/logging';
	import Empty from '$lib/components/structure/Empty.svelte';
	import { isOk, type FetchResult } from '$lib/code/db/types';

	import {user} from "$lib/code/stores/user"

	export let data: any;
	export let user_data: any;

	let nickname = writable<string | null>(null);
	let password = writable<string | null>(null);

	let is_valid_login_input = derived([nickname, password], ([$nickname, $password]) => {
		return $nickname != null && $nickname != '';
	});

	async function try_login_by_cookies() {

		logger.plog('Try login by cookies');
		const response = await fetch('/api/users/fetch',{
			method: 'POST'
		});
		const result: FetchResult = (await response.json()) as FetchResult;

		if(isOk(result)){
			user.login(result.value);
			if($user != null) {
				logger.plog(`User: nickname: ${$user.name}, user role: ${$user.role}`);				
			}else{
				logger.plog('Login response is null');
			}
		}else{
			logger.plog(result.message);
		}
	}

	async function try_login_user() {
		logger.plog(`Nickname: ${$nickname}, Password: ${$password}`);
		const response = await fetch('/api/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nickname: $nickname,
				password: $password
			})
		});

		const result: FetchResult = (await response.json()) as FetchResult;

		logger.plog(result);
		if (isOk(result) && result.value != null) {
			// function undefined
			logger.plog('User logged in');
			user.login(result.value);
			if($user != null) {
				logger.plog(`User: nickname: ${$user.name}, user role: ${$user.role}`);
			}
		} else {
			logger.plog(result.message);
		}
	}

	async function try_register_user() {
		logger.plog(`Nickname: ${$nickname}, Password: ${$password}`);
		const response = await fetch('/api/users/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nickname: $nickname,
				password: $password
			})
		});

		const result: FetchResult = (await response.json()) as FetchResult;

		logger.plog(result);
		if (isOk(result)) {
			// function undefined
			logger.plog('user created');
		} else {
			logger.plog(result.message.join('\n'));
		}
	}

	onMount(async () => {
		logger.plog('[PAGE] data from server:\n' + JSON.stringify(data));
		logger.plog('[PAGE] data.user:\n' + JSON.stringify(data.user));

		await try_login_by_cookies();
	});
</script>

<Tile>
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

	<Column gap={1}>
		
		<TextInput bind:value={$nickname} placeholder="Enter your new nickname..." />
		<TextInput bind:value={$password} placeholder="Enter your new password..." />
		
			{#if !$is_valid_login_input}
				<InlineNotification
					hideCloseButton
					kind="info"
					title="Fill credentials:"
					subtitle="Enter your nickname and password to log in or sign up"
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
	{#if $user != null}
		<p>User nickname: {$user.name}</p>
		<p>User role: {$user.role}</p>
	{:else}
		<p>user: null</p>
	{/if}
</Tile>

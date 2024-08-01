<script lang="ts">
	import Column from '$lib/components/structure/Column.svelte';
	import Row from '$lib/components/structure/Row.svelte';
	import { Button, InlineNotification, TextInput, Tile } from 'carbon-components-svelte';
	import { derived, writable } from 'svelte/store';
	import type { Result } from 'ts-results-es';
	import type { PageData, PageServerData } from './$types';
	import { onMount } from 'svelte';
	import { Logbox, logger, message_to_log, print_logbox } from '$lib/code/utilities/logging';

	import { user_login, user_fetch, user_store, user_register, user_logout } from '$lib/code/stores/user';
	import LoginPort from '$lib/components/viewports/LoginPort.svelte';
	import Plane from '$lib/components/structure/Plane.svelte';
	import Header from '$lib/components/elements/header/Header.svelte';
	import { debug_store } from '$lib/code/stores/debug';
	import VerticalLine from '$lib/components/structure/VerticalLine.svelte';
	import Viewport from '$lib/components/structure/Viewport.svelte';
	import Bar from '$lib/components/structure/Bar.svelte';
	import CarbonLogout from '$lib/icons/CarbonLogout.svelte';

	debug_store.set(false);

	const viewport = writable<'login'|'main'| null>(null)
	$: {
		logger.plog(`Viewport set to: ${$viewport}`);
	}

	async function try_fetch_user() {
		const logbox = new Logbox();
		const result = await user_fetch(logbox);

		if (result.value == null) {
			for(const message of result.messages) {
				logbox.plog(message_to_log(message));
			}
			logbox.print();
			return;
		}

		user_store.logged_in(result.value);
		logbox.plog(`User: name: ${$user_store!.name}, user role: ${$user_store!.role}`);
		logbox.print();
	}

	async function logout(){
		const logbox = new Logbox();
		const result = await user_logout(logbox);

		if (result.value == null) {
			for(const message of result.messages) {
				logbox.plog(message_to_log(message));
			}
			logbox.print();
			return;
		}
		user_store.logged_out();
		logbox.plog(`User logged out`);
		logbox.print();
	}

	user_store.subscribe((user) => {
		if (user == null) {
			$viewport = 'login';
		} else {
			$viewport = 'main';
		}
	});

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
			<Bar direction="row-reverse">
				<Button kind="secondary" icon={CarbonLogout}
				on:click={logout}>Log out</Button>
			</Bar>
		{:else}
			<div>You are not logged in</div>
		{/if}
	</Header>
	<Viewport display={$viewport == 'login' || $viewport == null}><LoginPort /></Viewport>
</Plane>

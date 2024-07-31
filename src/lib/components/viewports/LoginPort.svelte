<script lang="ts">
	import { Button, InlineNotification, TextInput, Tile } from 'carbon-components-svelte';
	import { writable, derived } from 'svelte/store';
	import { user_login, user_register, user_store } from '$lib/code/stores/user';
	import { Logbox } from '$lib/code/utilities/logging';
	import Column from '$lib/components/structure/Column.svelte';
	import Row from '$lib/components/structure/Row.svelte';
	import Rig from '../structure/Rig.svelte';

	let name = writable<string | null>(null);
	let password = writable<string | null>(null);

	let is_valid_login_input = derived([name, password], ([$name, $password]) => {
		return $name != null && $name != '' && $password != null && $password != '';
	});

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
</script>

<div class="frame">
	<Rig width={12}>
		<Tile>
			<Rig height={8} width={36}>
				<Column gap={1}>
					<h2>Login to your account</h2>
					<TextInput bind:value={$name} placeholder="Enter your new name..." />
					<TextInput bind:value={$password} placeholder="Enter your new password..." />

					<Row justify_content="end">
						<Button disabled={!$is_valid_login_input} on:click={try_register_user} kind="secondary"
							>Sign Up</Button
						>
						<Button disabled={!$is_valid_login_input} on:click={try_login_user} kind="primary"
							>Log In</Button
						>
					</Row>
				</Column>
			</Rig>
		</Tile>
		{#if !$is_valid_login_input}
			<InlineNotification
				hideCloseButton
				kind="info"
				title="Fill credentials:"
				subtitle="Enter your name and password to log in or sign up"
			/>
		{/if}
	</Rig>
</div>

<style>
	.frame {
		width: 100%;

		position: relative;
		top: 25%;

		display: flex;
		flex-direction: column;
		align-items: center;
		/* justify-content: center; */
	}
</style>

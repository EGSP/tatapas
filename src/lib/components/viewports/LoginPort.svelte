<script lang="ts">
	import { Button, InlineNotification, TextInput, Tile } from 'carbon-components-svelte';
	import { writable, derived } from 'svelte/store';
	import { user_login, user_register, user_store } from '$lib/code/stores/user';
	import { chalk_kind, Logbox, message_to_log } from '$lib/code/utilities/logging';
	import Column from '$lib/components/structure/Column.svelte';
	import Row from '$lib/components/structure/Row.svelte';
	import Rig from '../structure/Rig.svelte';
	import { onMount } from 'svelte';
	import type { Message, Result, User } from '$lib/code/types';

	let name = writable<string | null>(null);
	let password = writable<string | null>(null);

	let is_valid_input = derived([name, password], ([$name, $password]) => {
		return $name != null && $name != '' && $password != null && $password != '';
	});

	let messages = writable<Message[]>([]);

	$: {
		$name, $password;
		messages.set([]);
	}

	async function try_login_user() {
		const logbox = new Logbox();
		logbox.plog(`User input: name: ${$name}, password: ${$password}`);

		const result = await user_login(logbox, $name!, $password!);
		if (result.value == null) {
			for (const message of result.messages) {
				logbox.plog(message_to_log(message));
			}
			logbox.print();
			messages.set(result.messages);
			return;
		}

		apply_login_data(result.value);
		logbox.plog(`User logged in : name: ${$user_store!.name}, user role: ${$user_store!.role}`);
		logbox.print();
	}

	async function try_register_user() {
		const logbox = new Logbox();
		logbox.plog(`User input: name: ${$name}, password: ${$password}`);

		const result = await user_register(logbox, $name!, $password!);
		if (result.value == null) {
			for (const message of result.messages) {
				logbox.plog(message_to_log(message));
			}
			logbox.print();
			messages.set(result.messages);
			return;
		}

		apply_login_data(result.value);
		logbox.plog(`User registered : name: ${$user_store!.name}, user role: ${$user_store!.role}`);
		logbox.print();
	}

	function apply_login_data(user:User){
		password.set(null);
		user_store.logged_in(user);
	}

	onMount(() => {
		user_store.subscribe((user) => {
			if (user != null) {
				name.set(user.name);
			}
		});
	});
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
						<Button disabled={!$is_valid_input} on:click={try_register_user} kind="secondary"
							>Sign Up</Button
						>
						<Button disabled={!$is_valid_input} on:click={try_login_user} kind="primary"
							>Log In</Button
						>
					</Row>
				</Column>
			</Rig>
		</Tile>
		{#if !$is_valid_input}
			<InlineNotification
				hideCloseButton
				kind="warning"
				title="Fill credentials:"
				subtitle="Enter your name and password to log in or sign up"
			/>
		{/if}
		{#if $messages.length > 0}
			{#each $messages as messages}
				<InlineNotification
					hideCloseButton
					kind={messages.kind}
					title={messages.title}
					subtitle={messages.subtitle}
				/>
			{/each}
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

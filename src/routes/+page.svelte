<script lang="ts">
	import Column from '$lib/components/structure/Column.svelte';
	import { Button, TextInput, Tile } from 'carbon-components-svelte';
	import { derived, writable } from 'svelte/store';
	import type { Result } from 'ts-results-es';

	let nickname = writable<string | null>(null);
	let password = writable<string | null>(null);

	let allow_register = derived([nickname, password], ([$nickname, $password]) => {
		return $nickname != null && $nickname != '';
	});

	$: console.log('[PAGE] Nickname: ' + $nickname);
	$: console.log('[PAGE] Password: ' + $allow_register);

	async function try_register_user() {
		console.log(`[PAGE] Nickname: ${$nickname}, Password: ${$password}`);
		const response = await fetch('/api/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nickname: $nickname,
				password: $password
			})
		});

		const result: Result<void, string[]> = (await response.json()) as Result<void, string[]>;

		console.log(result);
		if (result.isOk()) {
			// function undefined
			console.log('user created');
		} else {
			console.log(result.unwrapErr().join('\n'));
		}
	}
</script>

<Tile>
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

	<Column gap={1.5}>
		<TextInput bind:value={$nickname} placeholder="Enter your new nickname..." />
		<TextInput bind:value={$password} placeholder="Enter your new password..." />
		<Button disabled={!$allow_register} on:click={try_register_user} size="lg">Register</Button>
	</Column>
</Tile>

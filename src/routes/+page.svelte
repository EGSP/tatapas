<script lang="ts">
	import Column from '$lib/components/structure/Column.svelte';
	import { Button, TextInput, Tile } from 'carbon-components-svelte';
	import { derived, writable } from 'svelte/store';

	let nickname = writable<string | null>(null);
	let password = writable<string | null>(null);

	let allow_register = derived([nickname, password], ([$nickname, $password]) => {
		return $nickname != null && $nickname != '';
	});

    $: console.log($nickname);
	$: console.log($allow_register);

	async function try_register_user() {}
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

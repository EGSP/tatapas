<script lang="ts">
	import { debug_store } from "$lib/code/stores/debug";

	export let width: number | null = null;
	export let height: number | null = null;

	export let debug: boolean | undefined = undefined;
</script>

<div
	style:min-height={height ? height + 'rem' : null}
	style:min-width={width ? width + 'rem' : null}
	style:background-color={(debug || $debug_store) ? 'rgb(114 118 143 / 21%)' : null}
	style:outline={(debug || $debug_store) ? '1px solid rgb(132 114 143)' : null}
>
	<slot />
</div>

<!-- <style>
	div {
		width: 100%;
		height: 100%;
	}
</style> -->

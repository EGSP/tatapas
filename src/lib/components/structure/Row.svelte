<script lang="ts">
	export let gap: number = 0;
</script>

<div style:gap={gap ? gap + 'rem' : null}><slot /></div>

<style>
	div {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
	}
</style>

<script lang="ts">
	export let gap: number = 0;
	export let justify_content: 'start' | 'end' | 'center' = 'start';
</script>

<div style:gap={gap ? gap + 'rem' : null}
	 style:justify-content={justify_content}><slot /></div>

<style>
	div {
		width: 100%;
		display: flex;
		align-items: center;
	}
</style>

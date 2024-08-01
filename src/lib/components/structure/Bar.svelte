<script lang="ts">
    export let direction: 'row'|'row-reverse'|'column'|'column-reverse' = 'row';
</script>

<div style:flex-direction={direction}><slot /></div>

<style>
	div {
		width: 100%;
		display: flex;
        flex: 0 1 auto;
	}
</style>

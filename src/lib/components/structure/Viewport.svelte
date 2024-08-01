<script lang="ts">
    export let display:boolean|undefined = true;
</script>

<div style:display={display ? "block" : 'none'}>
	<slot />
</div>

<style>
	div {
		width: 100%;
		height: 100%;
		min-width: 100%;
		min-height: 100%;
	}
</style>

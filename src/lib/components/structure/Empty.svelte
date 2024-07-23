<script lang="ts">
	export let height: number = 0;
</script>

<div style:height={height ?  height + 'rem' : null}><slot /></div>

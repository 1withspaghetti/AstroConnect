<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<span class="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs font-semibold">
	{@render children?.()}
</span>

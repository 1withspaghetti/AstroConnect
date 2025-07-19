<script lang="ts">
	import Header from '@/components/Header.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<Header />
{@render children?.()}

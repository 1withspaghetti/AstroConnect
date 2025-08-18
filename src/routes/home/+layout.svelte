<script lang="ts">
	import Header from './Header.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<Header user={data.user} />
{@render children?.()}

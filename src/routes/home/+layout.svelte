<script lang="ts">
	import Header from './Header.svelte';
	import type { LayoutProps } from './$types';
	import AdminImpersonationHeader from '@/components/AdminImpersonationHeader.svelte';

	let { data, children }: LayoutProps = $props();
</script>

<Header user={data.user} isAdmin={data.isAdmin} />
<AdminImpersonationHeader
	isImpersonating={data.isImpersonating}
	user={data.user}
	class="top-[69px]"
/>
{@render children?.()}

<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import PostPage from '../../../../home/post/[postId]/PostPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Meta title="Preview" />

<main class="container mx-auto">
	<PostPage post={data.post} allowSubmit={false} isAdmin={false} />
</main>

<script lang="ts">
	import type { PageProps } from './$types';
	import PostPage from '@/components/PostPage.svelte';

	let { data }: PageProps = $props();
</script>

<main class="container mx-auto">
	<PostPage post={data.post} allowSubmit={false} />
</main>

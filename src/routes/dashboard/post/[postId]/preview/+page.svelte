<script lang="ts">
	import PostPage from '../../../../home/post/[postId]/PostPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main class="container mx-auto">
	<PostPage post={data.post} allowSubmit={false} />
</main>

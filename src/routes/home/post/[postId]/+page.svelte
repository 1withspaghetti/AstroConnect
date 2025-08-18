<script lang="ts">
	import type { PageProps } from './$types';
	import PostPage from './PostPage.svelte';

	let { data }: PageProps = $props();
</script>

<main class="container mx-auto">
	<PostPage post={data.post} formInputData={data.form} allowSubmit />
</main>

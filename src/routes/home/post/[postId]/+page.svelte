<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import type { PageProps } from './$types';
	import PostPage from './PostPage.svelte';

	let { data }: PageProps = $props();
</script>

<Meta
	title={data.post.title.substring(0, 60)}
	description={data.post.desc.substring(0, 160)}
	image={data.post.images[0]}
	author={data.post.owner.name}
/>

<main class="container mx-auto">
	<PostPage post={data.post} formInputData={data.form} allowSubmit isAdmin={data.isAdmin} />
</main>

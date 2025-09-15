<script lang="ts">
	import DescriptionEditForm from './DescriptionEditForm.svelte';
	import type { PageProps } from './$types';
	import Meta from '@/components/Meta.svelte';

	let { data }: PageProps = $props();

	let globalTags = $state<string[]>([]);
	let userTags = $state<string[]>([]);
	$effect(() => {
		data.globalTagsData.then((tags) => (globalTags = tags));
		data.userTagsData.then((tags) => (userTags = tags));
	});
</script>

<Meta title="Edit Description" />

<div class="mx-auto w-full max-w-4xl px-4 pb-16">
	<DescriptionEditForm
		postId={data.postId}
		user={data.user}
		proxyAs={data.proxyAs}
		images={data.images}
		{globalTags}
		{userTags}
		formInputData={data.form}
	/>
</div>

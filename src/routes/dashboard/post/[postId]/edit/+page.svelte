<script lang="ts">
	import DescriptionEditForm from './DescriptionEditForm.svelte';
	import type { PageProps } from './$types';
	import Meta from '@/components/Meta.svelte';
	import DescriptionEditImages from './DescriptionEditImages.svelte';
	import { Separator } from '@/components/ui/separator';
	import ApplicationEditForm from './ApplicationEditForm.svelte';

	let { data }: PageProps = $props();

	let globalTags = $state<string[]>([]);
	let userTags = $state<string[]>([]);
	$effect(() => {
		data.globalTagsData.then((tags) => (globalTags = tags));
		data.userTagsData.then((tags) => (userTags = tags));
	});
</script>

<Meta title="Edit Description" />

<div class="mx-auto w-full max-w-6xl px-4 pb-16">
	<DescriptionEditImages postId={data.postId} images={data.images} />
	<DescriptionEditForm
		user={data.user}
		proxyAs={data.proxyAs}
		{globalTags}
		{userTags}
		formInputData={data.descriptionForm}
	/>

	<div class="flex items-end justify-between">
		<h1 class="mt-8 text-2xl font-bold">Application</h1>
	</div>
	<Separator class="mt-1 mb-4" />
	<ApplicationEditForm formInputData={data.applicationForm} />
</div>

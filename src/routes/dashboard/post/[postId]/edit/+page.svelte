<script lang="ts">
	import DescriptionEditForm from './DescriptionEditForm.svelte';
	import type { PageProps } from './$types';
	import Meta from '@/components/Meta.svelte';
	import DescriptionEditImages from './DescriptionEditImages.svelte';
	import { Separator } from '@/components/ui/separator';
	import ApplicationEditForm from './ApplicationEditForm.svelte';
	import { Button } from '@/components/ui/button';
	import List from '@lucide/svelte/icons/list';
	import PostDropdownMenu from '@/components/PostDropdownMenu.svelte';

	let { data }: PageProps = $props();

	let globalTags = $state<string[]>([]);
	let postTags = $state<string[]>([]);
	$effect(() => {
		data.globalTagsData.then((tags) => (globalTags = tags));
		data.postTagsData.then((tags) => (postTags = tags));
	});
</script>

<Meta title="Edit Description" />

<div class="mx-auto w-full max-w-6xl px-4 pb-16">
	<div class="flex items-end justify-between">
		<h1 id="description" class="mt-8 line-clamp-1 text-2xl font-bold">
			Description {#if data.post.isDraft}<span class="text-muted-foreground">(Draft)</span>{/if}
		</h1>
		<div class="flex gap-2">
			<Button
				variant="default"
				href="/dashboard/post/{data.post.id}/responses"
				class="text-primary dark:text-primary-foreground bg-green-300 hover:bg-green-400"
			>
				<List />
				Responses
			</Button>
			<PostDropdownMenu
				post={data.post}
				userId={data.user.id}
				isAdmin={data.isAdmin}
				hasAccessToEditOverride
			/>
		</div>
	</div>
	<Separator class="mt-1 mb-4" />

	<DescriptionEditImages postId={data.post.id} images={data.postImages} />
	<DescriptionEditForm
		user={data.user}
		proxyAs={data.proxyAs}
		{globalTags}
		{postTags}
		formInputData={data.descriptionForm}
	/>

	<div class="flex items-end justify-between">
		<h1 id="application" class="mt-8 line-clamp-1 text-2xl font-bold">Application</h1>
	</div>
	<Separator class="mt-1 mb-4" />

	<ApplicationEditForm formInputData={data.applicationForm} />
</div>

<script lang="ts">
	import DescriptionEditForm from './DescriptionEditForm.svelte';
	import type { PageProps, SubmitFunction } from './$types';
	import Meta from '@/components/Meta.svelte';
	import DescriptionEditImages from './DescriptionEditImages.svelte';
	import { Separator } from '@/components/ui/separator';
	import ApplicationEditForm from './ApplicationEditForm.svelte';
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button, buttonVariants } from '@/components/ui/button';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Trash from '@lucide/svelte/icons/trash';
	import List from '@lucide/svelte/icons/list';

	let { data }: PageProps = $props();

	let globalTags = $state<string[]>([]);
	let userTags = $state<string[]>([]);
	$effect(() => {
		data.globalTagsData.then((tags) => (globalTags = tags));
		data.userTagsData.then((tags) => (userTags = tags));
	});

	let publishDialogOpen = $state(false);
	let unpublishDialogOpen = $state(false);
	let deleteDialogOpen = $state(false);

	const enhanceCallback: SubmitFunction = () => {
		return async ({ update }) => {
			await update();
			publishDialogOpen = false;
			unpublishDialogOpen = false;
			deleteDialogOpen = false;
		};
	};
</script>

<Meta title="Edit Description" />

<div class="mx-auto w-full max-w-6xl px-4 pb-16">
	<div class="flex items-end justify-between">
		<h1 id="description" class="mt-8 line-clamp-1 text-2xl font-bold">
			Description {#if data.isDraft}<span class="text-muted-foreground">(Draft)</span>{/if}
		</h1>
		<Button
			variant="default"
			href="/dashboard/post/{data.postId}/responses"
			class="text-primary dark:text-primary-foreground bg-green-300 hover:bg-green-400"
		>
			<List />
			Responses
		</Button>
	</div>
	<Separator class="mt-1 mb-4" />

	<DescriptionEditImages postId={data.postId} images={data.images} />
	<DescriptionEditForm
		user={data.user}
		proxyAs={data.proxyAs}
		{globalTags}
		{userTags}
		formInputData={data.descriptionForm}
	/>

	<div class="flex items-end justify-between">
		<h1 id="application" class="mt-8 line-clamp-1 text-2xl font-bold">Application</h1>
	</div>
	<Separator class="mt-1 mb-4" />

	<ApplicationEditForm formInputData={data.applicationForm} />

	<div class="flex items-end justify-between">
		<h1 id="actions" class="mt-8 line-clamp-1 text-2xl font-bold">Actions</h1>
	</div>
	<Separator class="mt-1 mb-4" />
	<div class="flex flex-wrap justify-center gap-2">
		<Button variant="default" href="/dashboard/post/{data.postId}/preview">
			<Eye />
			Preview
		</Button>
		{#if data.isDraft}
			<Button variant="outline" onclick={() => (publishDialogOpen = true)}>
				<Eye />
				Publish
			</Button>
		{:else}
			<Button variant="outline" onclick={() => (unpublishDialogOpen = true)}>
				<EyeOff />
				Unpublish
			</Button>
		{/if}
		<Button variant="destructive" onclick={() => (deleteDialogOpen = true)}>
			<Trash />
			Delete
		</Button>
	</div>
</div>

<AlertDialog.Root bind:open={publishDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action will publish the post, making it visible to the public. Ensure that all details
				are correct before proceeding.<br /><br />
				<i>Don't worry, you can still edit the post after publishing, or unpublish it if needed.</i>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form
			use:enhance={enhanceCallback}
			method="POST"
			action="/dashboard/post/{page.params.postId}?/publish"
			class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
		>
			<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action type="submit">Publish</AlertDialog.Action>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={unpublishDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action will unpublish the post, making it no longer visible to the public. If you just
				want to make changes, you can edit the post without unpublishing it.<br /><br />
				If you want to close the post to new responses, you can instead do that in the same place you
				edit the application.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form
			use:enhance={enhanceCallback}
			method="POST"
			action="/dashboard/post/{page.params.postId}?/unpublish"
			class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
		>
			<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action type="submit">Unpublish</AlertDialog.Action>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the post and all of its data. If
				the post is published, it will also be removed from the public view, and all responses will
				be lost.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form
			use:enhance={enhanceCallback}
			method="POST"
			action="/dashboard/post/{page.params.postId}?/delete"
			class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
		>
			<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action type="submit" class={buttonVariants({ variant: 'destructive' })}
				>Delete</AlertDialog.Action
			>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>

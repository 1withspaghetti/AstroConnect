<script lang="ts">
	import { page } from '$app/state';
	import { Separator } from '@/components/ui/separator';
	import type { LayoutProps, SubmitFunction } from './$types';
	import { Button, buttonVariants } from '@/components/ui/button';
	import Trash from '@lucide/svelte/icons/trash';
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import Menu from '@lucide/svelte/icons/menu';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import { enhance } from '$app/forms';

	const tabs = [
		{
			label: 'Description',
			href: '/edit/description'
		},
		{
			label: 'Application',
			href: '/edit/application'
		},
		{
			label: 'Preview',
			href: '/preview'
		},
		{
			label: 'Responses',
			href: '/responses'
		}
	];

	let { data, children }: LayoutProps = $props();

	let relativePath = $derived('/dashboard/post/' + page.params.postId);

	let currentPostNavItem = $derived(data.postList.find((post) => post.id === page.params.postId));

	let publishDialogOpen = $state(false);
	let unpublishDialogOpen = $state(false);
	let deleteDialogOpen = $state(false);

	const enhanceCallback: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();
			publishDialogOpen = false;
			unpublishDialogOpen = false;
			deleteDialogOpen = false;
		};
	};
</script>

<div class="mx-auto max-w-6xl px-4">
	<div class="flex items-end justify-between">
		<h1 class="mt-8 line-clamp-1 text-2xl font-bold">
			{currentPostNavItem?.title || 'Post Details'}
			{#if currentPostNavItem?.isDraft}
				<span class="text-muted-foreground">(Draft)</span>
			{/if}
		</h1>
		<div class="hidden items-center gap-2 lg:flex">
			{#if currentPostNavItem?.isDraft}
				<Button onclick={() => (publishDialogOpen = true)}>
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
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="cursor-pointer lg:hidden">
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="icon">
						<span class="sr-only">Actions</span>
						<Menu class="size-6" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#if currentPostNavItem?.isDraft}
					<DropdownMenu.Item onclick={() => (publishDialogOpen = true)}>
						<Eye />
						Publish
					</DropdownMenu.Item>
				{:else}
					<DropdownMenu.Item onclick={() => (unpublishDialogOpen = true)}>
						<EyeOff />
						Unpublish
					</DropdownMenu.Item>
				{/if}
				<DropdownMenu.Item variant="destructive" onclick={() => (deleteDialogOpen = true)}>
					<Trash />
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<Separator class="mt-1" />
</div>

<div class="flex justify-center p-4">
	<div
		class="bg-muted text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-lg p-[3px]"
	>
		{#each tabs as tab}
			{@const isActive = page.url.pathname.startsWith(relativePath + tab.href)}
			<a
				href={relativePath + tab.href}
				data-state={isActive ? 'active' : ''}
				role="tab"
				aria-selected={isActive}
				tabindex={isActive ? -1 : 0}
				class="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
				>{tab.label}</a
			>
		{/each}
	</div>
</div>

{@render children?.()}

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
				If you want to close the post to new responses, you can instead do that on the
				<a href="/dashboard/post/{page.params.postId}/responses" class="underline">responses tab</a
				>.
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

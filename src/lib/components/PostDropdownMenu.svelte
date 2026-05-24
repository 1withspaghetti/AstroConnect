<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import { Button, buttonVariants } from './ui/button';
	import * as DropdownMenu from './ui/dropdown-menu';
	import UserPen from '@lucide/svelte/icons/user-pen';
	import Trash from '@lucide/svelte/icons/trash';
	import Link from '@lucide/svelte/icons/link';
	import Pencil from '@lucide/svelte/icons/pencil';
	import type { PostPreview } from '@/types/post';
	import { toast } from 'svelte-sonner';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import apiRequest from '@/util/apiClient';
	import { goto, invalidateAll } from '$app/navigation';
	import * as AlertDialog from './ui/alert-dialog';
	import List from '@lucide/svelte/icons/list';
	import { resolve } from '$app/paths';
	import Eye from '@lucide/svelte/icons/eye';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Mail from '@lucide/svelte/icons/mail';

	let {
		post,
		userId,
		isAdmin,
		hasAccessToEditOverride = false
	}: {
		post: PostPreview;
		userId: string;
		isAdmin: boolean;
		hasAccessToEditOverride?: boolean;
	} = $props();

	let publishDialogOpen = $state(false);
	let unpublishDialogOpen = $state(false);
	let deleteDialogOpen = $state(false);

	function copyText(text: string) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success('Copied to clipboard');
			})
			.catch((e) => {
				console.log(e);
				toast.error('Failed to copy text');
			});
	}

	function logInAsUser(callback: () => void) {
		apiRequest('GET', '/login/admin/user/' + encodeURIComponent(post.owner.email))
			.then(() => {
				toast.success(`Switched to user: ${post.owner.email}`);
				callback();
			})
			.catch((err) => {
				toast.error('Failed to switch user: ' + err.message);
			});
	}

	const enhanceCallback: SubmitFunction = () => {
		return async ({ update }) => {
			await update();
			publishDialogOpen = false;
			unpublishDialogOpen = false;
			deleteDialogOpen = false;
		};
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon">
				<Ellipsis />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item
				onclick={() => copyText(new URL(`/home/post/${post.id}`, PUBLIC_BASE_URL).toString())}
				class="cursor-pointer"
			>
				<Link /> Copy Link
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => copyText(post.owner.email)} class="cursor-pointer">
				<Mail /> Copy Author Email
			</DropdownMenu.Item>
			{#if hasAccessToEditOverride || userId === post.owner.id}
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					onclick={() => goto(resolve(`/dashboard/post/${post.id}/edit`), { invalidateAll: true })}
					class="cursor-pointer"
				>
					<Pencil /> Edit Post
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() =>
						goto(resolve(`/dashboard/post/${post.id}/preview`), { invalidateAll: true })}
					class="cursor-pointer"
				>
					<Eye /> Preview
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() =>
						goto(resolve(`/dashboard/post/${post.id}/responses`), { invalidateAll: true })}
					class="cursor-pointer"
				>
					<List /> View Responses
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				{#if post.isDraft}
					<DropdownMenu.Item onclick={() => (publishDialogOpen = true)} class="cursor-pointer">
						<Eye /> Publish
					</DropdownMenu.Item>
				{:else}
					<DropdownMenu.Item onclick={() => (unpublishDialogOpen = true)} class="cursor-pointer">
						<EyeOff /> Unpublish
					</DropdownMenu.Item>
				{/if}
				<DropdownMenu.Item
					onclick={() => (deleteDialogOpen = true)}
					variant="destructive"
					class="cursor-pointer"
				>
					<Trash /> Delete Post
				</DropdownMenu.Item>
			{/if}
			{#if isAdmin && userId !== post.owner.id}
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => logInAsUser(invalidateAll)} class="cursor-pointer">
					<UserPen /> Log In As Author
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() =>
						logInAsUser(() =>
							goto(resolve(`/dashboard/post/${post.id}/edit`), { invalidateAll: true })
						)}
					class="cursor-pointer"
				>
					<Pencil /> Log In As Author & Edit Post
				</DropdownMenu.Item>
				{#if !(hasAccessToEditOverride || userId === post.owner.id)}
					<!-- To prevent the delete from showing up twice -->
					<DropdownMenu.Item
						onclick={() => (deleteDialogOpen = true)}
						variant="destructive"
						class="cursor-pointer"
					>
						<Trash /> Delete Post
					</DropdownMenu.Item>
				{/if}
			{/if}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

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
			action="/dashboard/post/{post.id}?/publish"
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
			action="/dashboard/post/{post.id}?/unpublish"
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
			action="/dashboard/post/{post.id}?/delete"
			class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
		>
			<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action type="submit" class={buttonVariants({ variant: 'destructive' })}
				>Delete</AlertDialog.Action
			>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>

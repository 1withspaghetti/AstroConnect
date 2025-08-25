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

	let { post, isAdmin }: { post: PostPreview; isAdmin: boolean } = $props();

	let deleteModelOpen = $state(false);

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

	function deletePost() {
		apiRequest('DELETE', '/dashboard/admin/posts/' + encodeURIComponent(post.id))
			.then(() => {
				toast.success(`Deleted post: ${post.title}`);
				invalidateAll();
			})
			.catch((err) => {
				toast.error('Failed to delete post: ' + err.message);
			})
			.finally(() => {
				deleteModelOpen = false;
			});
	}
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
			{#if isAdmin}
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => logInAsUser(invalidateAll)} class="cursor-pointer">
					<UserPen /> Log In As Author
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() =>
						logInAsUser(() =>
							goto(`/dashboard/post/${post.id}/edit/description`, { invalidateAll: true })
						)}
					class="cursor-pointer"
				>
					<Pencil /> Log In As Author & Edit Post
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() => (deleteModelOpen = true)}
					variant="destructive"
					class="cursor-pointer"
				>
					<Trash /> Delete Post
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root bind:open={deleteModelOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This will delete the post, "{post.title}", including all its applications, images, and data.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={deletePost} class={buttonVariants({ variant: 'destructive' })}
				>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

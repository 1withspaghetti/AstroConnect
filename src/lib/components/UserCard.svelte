<script lang="ts">
	import type { User, UserProfile } from '@/types/user';
	import * as Card from '@/components/ui/card';
	import * as Avatar from '@/components/ui/avatar';
	import Mail from '@lucide/svelte/icons/mail';
	import { Badge } from './ui/badge';
	import * as DropdownMenu from './ui/dropdown-menu';
	import { Button, buttonVariants } from './ui/button';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import { toast } from 'svelte-sonner';
	import apiRequest from '@/util/apiClient';
	import { invalidateAll } from '$app/navigation';
	import Trash from '@lucide/svelte/icons/trash';
	import ShieldPlus from '@lucide/svelte/icons/shield-plus';
	import ShieldMinus from '@lucide/svelte/icons/shield-minus';
	import * as AlertDialog from './ui/alert-dialog';
	import dayjs from '@/util/dayjs';
	import UserPen from '@lucide/svelte/icons/user-pen';
	import UserAvatar from './UserAvatar.svelte';

	let { user, isAdmin }: { user: UserProfile | User; isAdmin: boolean } = $props();

	let promoteModelOpen = $state(false);
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

	function logInAsUser() {
		apiRequest('GET', '/login/admin/user/' + encodeURIComponent(user.email))
			.then(() => {
				toast.success(`Switched to user: ${user.email}`);
				invalidateAll();
			})
			.catch((err) => {
				toast.error('Failed to switch user: ' + err.message);
			});
	}

	function setAdmin(isAdmin: boolean) {
		apiRequest('PATCH', '/dashboard/admin/users/' + encodeURIComponent(user.id), { isAdmin })
			.then(() => {
				toast.success(`${isAdmin ? 'Promoted' : 'Demoted'} user: ${user.email}`);
				invalidateAll();
			})
			.catch((err) => {
				toast.error('Failed to change user admin status: ' + err.message);
			})
			.finally(() => {
				promoteModelOpen = false;
			});
	}

	function deleteUser() {
		apiRequest('DELETE', '/dashboard/admin/users/' + encodeURIComponent(user.id))
			.then(() => {
				toast.success(`Deleted user: ${user.email}`);
				invalidateAll();
			})
			.catch((err) => {
				toast.error('Failed to delete user: ' + err.message);
			})
			.finally(() => {
				deleteModelOpen = false;
			});
	}
</script>

<Card.Root class="relative w-full max-w-xs">
	<Card.Content class="flex flex-col items-center">
		<UserAvatar {user} class="mb-2 size-12" />
		<Card.Title class="line-clamp-1 pb-1">
			{user.name}
			{#if user.isAdmin}
				<Badge variant="destructive">Admin</Badge>
			{/if}
		</Card.Title>
		<div class="text-muted-foreground flex items-end text-sm">
			<Mail class="mr-1 h-4 w-4" />
			<a href={`mailto:${user.email}`} target="_blank" class="underline">{user.email}</a>
		</div>
		<div class="mt-4 mb-2 text-sm">
			{user.bio || 'No bio provided.'}
		</div>
		{#if user.careerStage || user.major}
			<div class="text-muted-foreground mt-2 text-sm">
				{user.careerStage}
				{user.careerStage && user.major ? ' • ' : ''}
				{user.major}
			</div>
		{/if}
		{#if user.tags}
			<div class="mt-2 flex flex-wrap gap-2">
				{#each user.tags as tag}
					<Badge>{tag}</Badge>
				{/each}
			</div>
		{/if}
	</Card.Content>
	{#if 'firstLogin' in user}
		<Card.Footer
			class="text-muted-foreground h-full flex-col items-start justify-end gap-x-2 text-xs"
		>
			<span>
				<u>Public Researcher:</u> <span>{user.isPublic ? 'Yes' : 'No'}</span>
			</span>
			<span>
				<u>Signed Up:</u>
				<span title={dayjs(user.firstLogin).format('LLLL')}
					>{dayjs(user.firstLogin).format('MMMM D, YYYY')}</span
				>
			</span>
			<span>
				<u>Last Login:</u>
				<span title={dayjs(user.lastLogin).format('LLLL')}
					>{dayjs(user.lastLogin).format('MMMM D, YYYY')}</span
				>
			</span>
			<span>
				<u>User ID:</u> <span>{user.id}</span>
			</span>
		</Card.Footer>
	{/if}
	<div class="text-muted-foreground absolute top-2 right-2 text-xs">
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
					<DropdownMenu.Item onclick={() => copyText(user.email)} class="cursor-pointer">
						<Mail /> Copy Email
					</DropdownMenu.Item>
					{#if isAdmin}
						<DropdownMenu.Separator />
						<DropdownMenu.Item onclick={logInAsUser} class="cursor-pointer">
							<UserPen /> Log In As User
						</DropdownMenu.Item>
						{#if !user.isAdmin}
							<DropdownMenu.Item onclick={() => (promoteModelOpen = true)} class="cursor-pointer">
								<ShieldPlus /> Promote to Admin
							</DropdownMenu.Item>
						{:else}
							<DropdownMenu.Item onclick={() => setAdmin(false)} class="cursor-pointer">
								<ShieldMinus /> Demote from Admin
							</DropdownMenu.Item>
						{/if}
						<DropdownMenu.Item
							onclick={() => (deleteModelOpen = true)}
							variant="destructive"
							class="cursor-pointer"
						>
							<Trash /> Delete User
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</Card.Root>

<AlertDialog.Root bind:open={promoteModelOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This will give the user, {user.email}, complete control to view, edit, and delete all
				content, as well as log in as other users. Make sure you trust them with this power.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={() => setAdmin(true)}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={deleteModelOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This will delete the user, {user.email}, including all their posts, applications, and other
				data.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={deleteUser} class={buttonVariants({ variant: 'destructive' })}
				>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

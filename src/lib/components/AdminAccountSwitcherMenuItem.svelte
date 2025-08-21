<script lang="ts">
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import Users from '@lucide/svelte/icons/users';
	import * as Command from './ui/command';
	import * as AlertDialog from './ui/alert-dialog';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import apiRequest from '@/util/apiClient';
	import { toast } from 'svelte-sonner';
	import { z } from 'zod/v4';
	import { Skeleton } from './ui/skeleton';
	import { invalidateAll } from '$app/navigation';

	const emailValidator = z.email();

	let open = $state(false);
	let newUserConfirmOpen = $state(false);

	let search = $state('');
	let loading = $state(false);

	let results = $state<string[]>([]);
	let isSearchAValidEmail = $derived(emailValidator.safeParse(search).success);

	let mostRecent = writable<string[]>([]);

	onMount(() => {
		mostRecent.set(JSON.parse(localStorage.getItem('adminAccountSwitcherMostRecent') || '[]'));
		mostRecent.subscribe((value) => {
			localStorage.setItem('adminAccountSwitcherMostRecent', JSON.stringify(value));
		});
	});

	let debounceTimeout: NodeJS.Timeout;
	$effect(() => {
		search;
		loading = true;
		results = [];
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			searchUsers()
				.catch((err) => {
					toast.error('Failed to search users: ' + err.message);
				})
				.finally(() => {
					loading = false;
				});
		}, 500);
	});

	async function searchUsers() {
		if (!search) {
			results = [];
			return;
		}

		const res = await apiRequest('GET', `/login/admin/users?q=${encodeURIComponent(search)}`);
		results = res.users as string[];
	}

	function select(value: string) {
		mostRecent.update((users) => {
			if (users.includes(value)) users = users.filter((user) => user !== value);
			users.unshift(value);
			return users.slice(0, 5); // Keep only the most recent 5 users
		});

		open = false;
		newUserConfirmOpen = false;

		apiRequest('GET', '/login/admin/user/' + encodeURIComponent(value))
			.then(() => {
				toast.success(`Switched to user: ${value}`);
				invalidateAll();
			})
			.catch((err) => {
				toast.error('Failed to switch user: ' + err.message);
			});
	}
</script>

<DropdownMenu.Item
	onclick={(e) => {
		e.preventDefault();
		e.stopPropagation();
		open = true;
	}}
	class="cursor-pointer"
>
	<Users />
	Switch Account
</DropdownMenu.Item>

<Command.Dialog bind:open>
	<Command.Input placeholder="Search Users" bind:value={search} />
	<Command.List>
		{#if search && results.length === 0 && !loading && !isSearchAValidEmail}
			<Command.Empty>No results found. Enter a valid email to add a new user</Command.Empty>
		{/if}
		{#if $mostRecent.length}
			<Command.Group heading="Recent">
				{#each $mostRecent as user}
					<Command.Item onclick={() => select(user)}>
						{user}
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}
		<Command.Group
			heading="All Users"
			forceMount={!(search && results.length === 0 && !loading && !isSearchAValidEmail)}
		>
			{#each results as user}
				<Command.Item onclick={() => select(user)}>
					{user}
				</Command.Item>
			{:else}
				{#if loading}
					<Skeleton class="w-full h-11 mb-1 rounded-sm" />
					<Skeleton class="w-full h-11 mb-1 rounded-sm" />
					<Skeleton class="w-full h-11 mb-1 rounded-sm" />
				{:else if search.length && isSearchAValidEmail}
					<Command.Item forceMount onclick={() => (newUserConfirmOpen = true)}>
						Add "{search}" as a new user
					</Command.Item>
				{:else}
					<Command.Item forceMount disabled>Start typing to search</Command.Item>
				{/if}
			{/each}
		</Command.Group>
	</Command.List>
</Command.Dialog>

<AlertDialog.Root bind:open={newUserConfirmOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This will create a new user account under the email <b>{search}</b>. They will automatically
				be linked to that account once they log in for the first time.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={() => select(search)}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

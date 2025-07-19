<script lang="ts">
	import { page } from '$app/state';
	import Button from './ui/button/button.svelte';
	import Search from '@lucide/svelte/icons/search';
	import FileUp from '@lucide/svelte/icons/file-up';
	import UserPen from '@lucide/svelte/icons/user-pen';
	import Files from '@lucide/svelte/icons/files';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Settings from '@lucide/svelte/icons/settings';
	import * as Avatar from './ui/avatar';
	import * as DropdownMenu from './ui/dropdown-menu';
	import { goto } from '$app/navigation';

	let path = page.url.pathname;
</script>

<div class="bg-background sticky top-0 z-40 border-b">
	<div class="container mx-auto flex items-center justify-between px-4 py-4">
		<h1 class="text-2xl font-bold">AstroConnect</h1>
		<nav class="flex space-x-4">
			<Button href="/dashboard/search" variant="default"
				><Search /> <span class="hidden sm:inline">Search for Research</span></Button
			>
			<Button href="/dashboard/post" variant="outline"
				><FileUp /> <span class="hidden sm:inline">Post Research</span></Button
			>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="cursor-pointer">
					{#snippet child({ props })}
						<Avatar.Root {...props}>
							<Avatar.Image src="https://github.com/ifgc.png" alt="@ifgc" />
							<Avatar.Fallback>IF</Avatar.Fallback>
						</Avatar.Root>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Item><UserPen /> Profile</DropdownMenu.Item>
						<DropdownMenu.Item><Files /> My Posted Research</DropdownMenu.Item>
						<DropdownMenu.Item><Bookmark /> Saved Research</DropdownMenu.Item>
						<DropdownMenu.Item><Settings /> Settings</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							variant="destructive"
							onclick={() => goto('/')}
							class="cursor-pointer">Logout</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</nav>
	</div>
</div>

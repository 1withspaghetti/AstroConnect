<script>
	import UserPen from '@lucide/svelte/icons/user-pen';
	import Files from '@lucide/svelte/icons/files';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Settings from '@lucide/svelte/icons/settings';
	import Info from '@lucide/svelte/icons/info';
	import * as Avatar from './ui/avatar';
	import * as DropdownMenu from './ui/dropdown-menu';
	import { goto } from '$app/navigation';
	import FileUp from '@lucide/svelte/icons/file-up';
	import Search from '@lucide/svelte/icons/search';

	const navData = [
		[
			{
				href: '/home/search',
				icon: Search,
				label: 'Search Research'
			},
			{
				href: '/dashboard/saved',
				icon: Bookmark,
				label: 'Bookmarked'
			}
		],
		[
			{
				href: '/dashboard/posts',
				icon: FileUp,
				label: 'Post Research Opportunity'
			},
			{
				href: '/dashboard/posts',
				icon: Files,
				label: 'My Posts'
			}
		],
		[
			{
				href: '/dashboard/profile',
				icon: UserPen,
				label: 'Edit Profile'
			},
			{
				href: '/dashboard/settings',
				icon: Settings,
				label: 'Settings'
			},
			{
				href: '/dashboard/info',
				icon: Info,
				label: 'Info & Contact'
			}
		]
	];
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="cursor-pointer">
		{#snippet child({ props })}
			<Avatar.Root {...props}>
				<Avatar.Image src="https://github.com/ifgc.png" alt="ifgc" />
				<Avatar.Fallback>IF</Avatar.Fallback>
			</Avatar.Root>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			{#each navData as group}
				{#each group as item (item.label)}
					<DropdownMenu.Item onclick={() => goto(item.href)} class="cursor-pointer">
						<item.icon />
						{item.label}
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
			{/each}
			<DropdownMenu.Item variant="destructive" onclick={() => goto('/')} class="cursor-pointer"
				>Logout</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

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
	import Plus from '@lucide/svelte/icons/plus';
	import Eye from '@lucide/svelte/icons/eye';
	import UserAvatar from './UserAvatar.svelte';
	import fakeData from '@/fake_data';

	const navData = [
		[
			{
				href: '/home/search',
				icon: Search,
				label: 'Search Research'
			},
			{
				href: '/home/search',
				icon: Bookmark,
				label: 'Bookmarked'
			}
		],
		[
			{
				href: '/dashboard/drafts',
				icon: Plus,
				label: 'Post Research Opportunity'
			},
			{
				href: '/dashboard/published',
				icon: Eye,
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

	const user = fakeData[0].owner;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="cursor-pointer">
		{#snippet child({ props })}
			<UserAvatar {user} {...props} />
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

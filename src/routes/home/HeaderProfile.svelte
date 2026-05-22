<script lang="ts">
	import UserPen from '@lucide/svelte/icons/user-pen';
	import Settings from '@lucide/svelte/icons/settings';
	import Info from '@lucide/svelte/icons/info';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { goto } from '$app/navigation';
	import Plus from '@lucide/svelte/icons/plus';
	import Eye from '@lucide/svelte/icons/eye';
	import UserAvatar from '@/components/UserAvatar.svelte';
	import type { UserPreview } from '@/types/user';
	import AdminAccountSwitcherMenuItem from '@/components/AdminAccountSwitcherMenuItem.svelte';
	import Users from '@lucide/svelte/icons/users';
	import Pen from '@lucide/svelte/icons/pen';
	import Tags from '@lucide/svelte/icons/tags';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import { resolve } from '$app/paths';
	import type { Component } from 'svelte';
	import type { ResolvedPathname } from '$app/types';

	type NavData = {
		href: ResolvedPathname;
		icon: Component;
		label: string;
	}[][];

	const navData: NavData = [
		[
			{
				href: resolve('/dashboard'),
				icon: LayoutDashboard,
				label: 'Dashboard'
			}
		],
		[
			{
				href: resolve('/dashboard/profile'),
				icon: UserPen,
				label: 'Edit Profile'
			},
			{
				href: resolve('/dashboard/settings'),
				icon: Settings,
				label: 'Settings'
			},
			{
				href: resolve('/dashboard/info'),
				icon: Info,
				label: 'Info & Contact'
			}
		],
		[
			{
				href: resolve('/dashboard/drafts'),
				icon: Plus,
				label: 'Post Research Opportunity'
			},
			{
				href: resolve('/dashboard/drafts'),
				icon: Pen,
				label: 'Drafts'
			},
			{
				href: resolve('/dashboard/published'),
				icon: Eye,
				label: 'Published'
			}
		]
	];

	const { user, isAdmin }: { user: UserPreview; isAdmin: boolean } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="cursor-pointer">
		{#snippet child({ props })}
			<UserAvatar {user} {...props} />
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			{#each navData as group, i (i)}
				{#each group as item (item.label)}
					<DropdownMenu.Item onclick={() => goto(item.href)} class="cursor-pointer">
						<item.icon />
						{item.label}
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
			{/each}
			{#if isAdmin}
				<DropdownMenu.Item
					onclick={() => goto(resolve('/dashboard/admin/users'))}
					class="cursor-pointer"
				>
					<Users />
					View User List [ADMIN]
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() => goto(resolve('/dashboard/admin/tags'))}
					class="cursor-pointer"
				>
					<Tags />
					Default Tags [ADMIN]
				</DropdownMenu.Item>
				<AdminAccountSwitcherMenuItem />
			{/if}
			<DropdownMenu.Item
				variant="destructive"
				onclick={() => goto(resolve('/login/logout'))}
				class="cursor-pointer">Logout</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

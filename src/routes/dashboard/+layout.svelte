<script lang="ts" module>
	import UserPen from '@lucide/svelte/icons/user-pen';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import FileUp from '@lucide/svelte/icons/file-up';
	import Files from '@lucide/svelte/icons/files';
	import Settings from '@lucide/svelte/icons/settings';
	import Info from '@lucide/svelte/icons/info';
	import Search from '@lucide/svelte/icons/search';

	export const navData = [
		{
			title: 'Home',
			items: [
				{
					href: '/home/search',
					icon: Search,
					label: 'Browse Research Opportunities'
				},
				{
					href: '/dashboard/saved',
					icon: Bookmark,
					label: 'Bookmarked'
				}
			]
		},
		{
			title: 'For Researchers',
			items: [
				{
					href: '/dashboard/post',
					icon: FileUp,
					label: 'Post Research Opportunity'
				},
				{
					href: '/dashboard/my-posts',
					icon: Files,
					label: 'My Posts'
				}
			]
		},
		{
			title: 'Other',
			items: [
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
		}
	];
</script>

<script lang="ts">
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '@/components/ui/separator';
	import DashboardSidebar from './dashboard-sidebar.svelte';
	import { page } from '$app/state';

	let { children }: LayoutProps = $props();

	let currentNavItem = $derived(
		navData.flatMap((group) => group.items).find((item) => page.url.pathname.startsWith(item.href))
	);

	const user = {
		name: 'ifgc',
		email: 'ifgc@uw.edu',
		avatar: 'https://github.com/ifgc.png'
	};
</script>

<Sidebar.Provider>
	<DashboardSidebar {user} />
	<Sidebar.Inset>
		<header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
					</Breadcrumb.Item>
					{#if currentNavItem}
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Link href={currentNavItem.href}>{currentNavItem.label}</Breadcrumb.Link>
						</Breadcrumb.Item>
					{/if}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<main>
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>

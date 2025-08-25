<script lang="ts" module>
	import UserPen from '@lucide/svelte/icons/user-pen';
	import Pen from '@lucide/svelte/icons/pen';
	import Settings from '@lucide/svelte/icons/settings';
	import Info from '@lucide/svelte/icons/info';
	import Eye from '@lucide/svelte/icons/eye';

	interface NavGroup {
		title: string;
		items: NavItem[];
		admin?: boolean;
		hasCreateNewPost?: boolean;
	}

	interface NavItem {
		href: string;
		icon: any;
		label: string;
		hasSubPosts?: boolean;
		subPostsAreDrafts?: boolean;
	}

	export const navData: NavGroup[] = [
		{
			title: 'For Researchers',
			hasCreateNewPost: true,
			items: [
				{
					href: '/dashboard/drafts',
					icon: Pen,
					label: 'Drafts',
					hasSubPosts: true,
					subPostsAreDrafts: true
				},
				{
					href: '/dashboard/published',
					icon: Eye,
					label: 'Published',
					hasSubPosts: true,
					subPostsAreDrafts: false
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
		},
		{
			title: 'Administration',
			admin: true,
			items: [
				{
					href: '/dashboard/admin/users',
					icon: Users,
					label: 'User List'
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
	import AdminImpersonationHeader from '@/components/AdminImpersonationHeader.svelte';
	import Users from '@lucide/svelte/icons/users';

	let { children, data }: LayoutProps = $props();

	let currentNavItem = $derived(
		navData.flatMap((group) => group.items).find((item) => page.url.pathname.startsWith(item.href))
	);

	let currentPostNavItem = $derived(
		page.url.pathname.startsWith(`/dashboard/post/`)
			? data.postList.find((post) => page.url.pathname.startsWith(`/dashboard/post/${post.id}`))
			: undefined
	);
</script>

<Sidebar.Provider>
	<DashboardSidebar posts={data.postList} user={data.user} isAdmin={data.isAdmin} />
	<Sidebar.Inset class="h-screen">
		<header class="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b px-4">
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
					{:else if currentPostNavItem}
						<Breadcrumb.Separator />
						{#if currentPostNavItem.isDraft}
							<Breadcrumb.Item>
								<Breadcrumb.Link href="/dashboard/drafts">Drafts</Breadcrumb.Link>
							</Breadcrumb.Item>
						{:else}
							<Breadcrumb.Item>
								<Breadcrumb.Link href="/dashboard/published">Published</Breadcrumb.Link>
							</Breadcrumb.Item>
						{/if}
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Link
								href={`/dashboard/post/${currentPostNavItem.id}`}
								class="line-clamp-1 max-w-sm"
							>
								{currentPostNavItem.title || 'Untitled Post'}
							</Breadcrumb.Link>
						</Breadcrumb.Item>
					{/if}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<main class="relative h-full overflow-y-auto">
			<AdminImpersonationHeader isImpersonating={data.isImpersonating} user={data.user} />
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>

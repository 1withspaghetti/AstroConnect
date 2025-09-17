<script lang="ts" module>
	import UserPen from '@lucide/svelte/icons/user-pen';
	import Pen from '@lucide/svelte/icons/pen';
	import Settings from '@lucide/svelte/icons/settings';
	import Info from '@lucide/svelte/icons/info';
	import Eye from '@lucide/svelte/icons/eye';
	import FileText from '@lucide/svelte/icons/file-text';
	import Tags from '@lucide/svelte/icons/tags';

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
			title: 'General',
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
			title: 'For Students',
			items: [
				{
					href: '/dashboard/applications',
					icon: FileText,
					label: 'My Applications'
				}
			]
		},
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
			title: 'Administration',
			admin: true,
			items: [
				{
					href: '/dashboard/admin/users',
					icon: Users,
					label: 'User List'
				},
				{
					href: '/dashboard/admin/tags',
					icon: Tags,
					label: 'Default Tags'
				}
			]
		}
	];

	export const postNavData: NavItem[] = [
		{
			href: '/edit',
			icon: Pen,
			label: 'Edit Post'
		},
		{
			href: '/preview',
			icon: Eye,
			label: 'Preview'
		},
		{
			href: '/responses',
			icon: List,
			label: 'Responses'
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
	import Meta from '@/components/Meta.svelte';
	import List from '@lucide/svelte/icons/list';

	let { children, data }: LayoutProps = $props();

	let currentNavItem = $derived(
		navData.flatMap((group) => group.items).find((item) => page.url.pathname.startsWith(item.href))
	);

	let currentPost = $derived(
		page.url.pathname.startsWith(`/dashboard/post/`)
			? data.postList.find((post) => page.url.pathname.startsWith(`/dashboard/post/${post.id}`))
			: undefined
	);

	let currentPostNavItem = $derived(
		currentPost
			? postNavData.find((item) =>
					page.url.pathname.startsWith(`/dashboard/post/${currentPost.id}` + item.href)
				)
			: undefined
	);
</script>

<Meta title="Dashboard" />

<Sidebar.Provider>
	<DashboardSidebar posts={data.postList} user={data.user} isAdmin={data.isAdmin} />
	<Sidebar.Inset class="h-screen">
		<header class="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root class="max-w-full overflow-x-hidden">
				<Breadcrumb.List class="flex-nowrap justify-end whitespace-nowrap">
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
					</Breadcrumb.Item>
					{#if currentNavItem}
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Link href={currentNavItem.href}>{currentNavItem.label}</Breadcrumb.Link>
						</Breadcrumb.Item>
					{:else if currentPost}
						<Breadcrumb.Separator />
						{#if currentPost.isDraft}
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
								href={`/dashboard/post/${currentPost.id}`}
								class="line-clamp-1 max-w-xs whitespace-normal"
							>
								{currentPost.title || 'Untitled Post'}
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						{#if currentPostNavItem}
							<Breadcrumb.Separator />
							<Breadcrumb.Item>
								<Breadcrumb.Link
									href={`/dashboard/post/${currentPost.id}` + currentPostNavItem.href}
									>{currentPostNavItem.label}</Breadcrumb.Link
								>
							</Breadcrumb.Item>
						{/if}
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

<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar';
	import { navData } from './+layout.svelte';
	import { page } from '$app/state';
	import DashboardSidebarUser from './dashboard-sidebar-user.svelte';
	import ChevronsLeft from '@lucide/svelte/icons/chevrons-left';
	import type { PostPreview } from '@/types/post';

	let { posts }: { posts: PostPreview[] } = $props();

	let draftPosts = $derived(posts.filter((post) => post.draft));
	let publishedPosts = $derived(posts.filter((post) => !post.draft));
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href="/home/search" {...props}>
							<ChevronsLeft />
							Back to Home
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
		<Sidebar.Separator />
	</Sidebar.Header>
	<Sidebar.Content>
		{#each navData as group (group.title)}
			<Sidebar.Group title={group.title}>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.label)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={page.url.pathname.startsWith(item.href) && !item.noActive}
								>
									{#snippet child({ props })}
										<a href={item.href} {...props}>
											<item.icon />
											{item.label}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
								{#if item.hasSubPosts}
									<Sidebar.MenuSub>
										{@const subPosts = item.subPostsAreDrafts ? draftPosts : publishedPosts}
										{#each subPosts as post (post.id)}
											<Sidebar.MenuSubItem>
												<Sidebar.MenuSubButton
													isActive={page.url.pathname.startsWith(`/dashboard/post/${post.id}`)}
													href={`/dashboard/post/${post.id}`}
												>
													<span class="line-clamp-1 {post.draft || !post.open ? 'text-muted-foreground' : ''}">{post.title || 'Untitled Post'}</span>
												</Sidebar.MenuSubButton>
											</Sidebar.MenuSubItem>
										{/each}
									</Sidebar.MenuSub>
								{/if}
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		<DashboardSidebarUser />
	</Sidebar.Footer>
</Sidebar.Root>

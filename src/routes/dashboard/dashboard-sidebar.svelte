<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar';
	import { navData } from './+layout.svelte';
	import { page } from '$app/state';
	import DashboardSidebarUser from './dashboard-sidebar-user.svelte';
	import ChevronsLeft from '@lucide/svelte/icons/chevrons-left';
	import type { PostMinimal } from '@/types/post';
	import { enhance } from '$app/forms';
	import Plus from '@lucide/svelte/icons/plus';
	import type { UserPreview } from '@/types/user';

	let { posts, user, isAdmin }: { posts: PostMinimal[]; user: UserPreview; isAdmin: boolean } =
		$props();

	let draftPosts = $derived(posts.filter((post) => post.isDraft));
	let publishedPosts = $derived(posts.filter((post) => !post.isDraft));

	const viewableNavData = navData.filter((item) => (item.admin ? isAdmin : true));
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
		{#each viewableNavData as group (group.title)}
			<Sidebar.Group title={group.title}>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#if group.hasCreateNewPost}
							<Sidebar.MenuItem>
								<form use:enhance method="POST" action="/dashboard/drafts?/new">
									<Sidebar.MenuButton>
										{#snippet child({ props })}
											<button type="submit" {...props}>
												<Plus />
												Post Research Opportunity
											</button>
										{/snippet}
									</Sidebar.MenuButton>
								</form>
							</Sidebar.MenuItem>
						{/if}
						{#each group.items as item (item.label)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={page.url.pathname.startsWith(item.href)}>
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
													<span class="line-clamp-1">{post.title || 'Untitled Post'}</span>
												</Sidebar.MenuSubButton>
											</Sidebar.MenuSubItem>
											{#if page.url.pathname.startsWith(`/dashboard/post/${post.id}`)}
												<Sidebar.MenuSub class="ml-2 border-0">
													<Sidebar.MenuSubItem>
														<Sidebar.MenuSubButton href={`/dashboard/post/${post.id}/edit`}>
															Edit
														</Sidebar.MenuSubButton>
													</Sidebar.MenuSubItem>
													<Sidebar.MenuSubItem>
														<Sidebar.MenuSubButton href={`/dashboard/post/${post.id}/preview`}>
															Preview
														</Sidebar.MenuSubButton>
													</Sidebar.MenuSubItem>
													<Sidebar.MenuSubItem>
														<Sidebar.MenuSubButton href={`/dashboard/post/${post.id}/responses`}>
															Responses
														</Sidebar.MenuSubButton>
													</Sidebar.MenuSubItem>
												</Sidebar.MenuSub>
											{/if}
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
		<DashboardSidebarUser {user} {isAdmin} />
	</Sidebar.Footer>
</Sidebar.Root>

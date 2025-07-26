<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar';
	import { navData } from './+layout.svelte';
	import { page } from '$app/state';
	import DashboardSidebarUser from './dashboard-sidebar-user.svelte';
	import ChevronsLeft from '@lucide/svelte/icons/chevrons-left';
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
								<Sidebar.MenuButton isActive={page.url.pathname.startsWith(item.href)}>
									{#snippet child({ props })}
										<a href={item.href} {...props}>
											<item.icon />
											{item.label}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
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

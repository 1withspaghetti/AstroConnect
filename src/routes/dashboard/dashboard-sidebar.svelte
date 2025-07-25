<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar';
	import { navData } from './+layout.svelte';
	import { page } from '$app/state';
	import DashboardSidebarUser from './dashboard-sidebar-user.svelte';

	let {
		user
	}: {
		user: {
			name: string;
			email: string;
			avatar: string;
		};
	} = $props();
</script>

<Sidebar.Root>
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
		<DashboardSidebarUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>

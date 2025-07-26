<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	const tabs = [
		{
			label: 'Description',
			href: '/edit/description'
		},
		{
			label: 'Application',
			href: '/edit/application'
		},
		{
			label: 'Preview',
			href: '/preview'
		},
		{
			label: 'Responses',
			href: '/responses'
		}
	];

	let { children }: LayoutProps = $props();

	let relativePath = $derived('/dashboard/post/' + page.params.postId);
</script>

<div class="flex justify-center p-4">
	<div
		class="bg-muted text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-lg p-[3px]"
	>
		{#each tabs as tab}
			{@const isActive = page.url.pathname.startsWith(relativePath + tab.href)}
			<a
				href={relativePath + tab.href}
				data-state={isActive ? 'active' : ''}
				role="tab"
				aria-selected={isActive}
				tabindex={isActive ? -1 : 0}
				class="data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
				>{tab.label}</a
			>
		{/each}
	</div>
</div>

{@render children?.()}

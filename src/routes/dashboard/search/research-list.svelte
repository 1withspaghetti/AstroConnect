<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Button } from '@/components/ui/button';

	type ResearchItem = {
		id: number;
		title: string;
		description: string;
		coverImage?: string;
		tags: string[];
		open: boolean;
		createdAt: string;
	};

	let { items }: { items: ResearchItem[] } = $props();
</script>

<div class="mb-4 flex flex-col gap-4 px-8">
	{#each items as item}
		<div class="bg-card text-card-foreground flex rounded-xl border shadow-sm">
			{#if item.coverImage}
				<img
					src={item.coverImage}
					alt={item.title}
					class="w-24 rounded-l-xl object-cover object-center sm:w-48"
				/>
			{/if}
			<div class="flex flex-1 flex-col gap-4 py-4">
				<Card.Header>
					<Card.Title>{item.title}</Card.Title>
					<Card.Description>{item.description}</Card.Description>
					<Card.Action>
						<Button disabled={!item.open}>Apply {item.open ? '' : '(Closed)'}</Button>
					</Card.Action>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-wrap gap-2">
						{#each item.tags as tag}
							<span
								class="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs font-semibold"
							>
								{tag}
							</span>
						{/each}
					</div>
				</Card.Content>
				<Card.Footer class="flex items-center justify-between">
					<span class="text-muted-foreground text-xs"
						>Posted {new Date(item.createdAt).toLocaleDateString()}</span
					>
				</Card.Footer>
			</div>
		</div>
	{/each}
</div>

<Pagination.Root count={100} perPage={10} class="mb-16">
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton />
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton />
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>

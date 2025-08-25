<script lang="ts">
	import type { PageProps } from './$types';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Skeleton } from '@/components/ui/skeleton';
	import { Label } from '@/components/ui/label';
	import UserCard from '@/components/UserCard.svelte';
	import SearchForm from '../../../home/researchers/search-form.svelte';
	import { defaultTags } from '@/types/post';

	let { data }: PageProps = $props();

	let tagList = $state(defaultTags);
	$effect(() => {
		data.userTagsData.then((tags) => {
			tagList = defaultTags.concat(tags.filter((tag) => !defaultTags.includes(tag)));
		});
	});
</script>

<div class="container mx-auto pb-16">
	<div class="px-8 py-8">
		<SearchForm {tagList} />
	</div>

	<div class="mx-auto mb-4">
		{#await data.usersData}
			<Skeleton class="mx-auto h-3.5 w-24" />
		{:then { total }}
			<Label class="justify-center">
				{#if total === 0}
					No results found
				{:else}
					{total} result{total > 1 ? 's' : ''} found
				{/if}
			</Label>
		{/await}
	</div>

	<div class="mx-auto mb-4 flex max-w-6xl flex-wrap justify-center gap-4 px-4">
		{#await data.usersData}
			<Skeleton class="h-64 w-full max-w-xs" />
			<Skeleton class="h-64 w-full max-w-xs" />
			<Skeleton class="h-64 w-full max-w-xs" />
		{:then { users }}
			{#each users as user}
				<UserCard {user} isAdmin={data.isAdmin} />
			{/each}
		{/await}
	</div>

	{#await data.usersData}
		<div class="flex justify-center">
			<Skeleton class="h-10 w-32" />
		</div>
	{:then { total }}
		{#if total > 0}
			<Pagination.Root count={total} perPage={25}>
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
		{/if}
	{/await}
</div>

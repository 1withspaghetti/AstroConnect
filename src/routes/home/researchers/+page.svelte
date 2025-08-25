<script lang="ts">
	import type { PageProps } from './$types';
	import SearchForm from './search-form.svelte';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Skeleton } from '@/components/ui/skeleton';
	import { Label } from '@/components/ui/label';
	import UserCard from '@/components/UserCard.svelte';
	import { defaultTags } from '@/types/post';
	import Meta from '@/components/Meta.svelte';

	let { data }: PageProps = $props();

	let tagList = $state(defaultTags);
	$effect(() => {
		data.userTagsData.then((tags) => {
			tagList = defaultTags.concat(tags.filter((tag) => !defaultTags.includes(tag)));
		});
	});
</script>

<Meta
	title="Search Researchers"
	description="Search for UW researchers who may be conducting astronomy research"
/>

<div class="container mx-auto pb-16">
	<div class="group relative w-full overflow-hidden">
		<enhanced:img
			alt="A University of Washington building with a blooming cherry tree in front of it"
			class="max-h-32 w-full object-cover object-center"
			src="$lib/assets/imgs/lokesh-b-masania-UwkKj6461fw-unsplash.jpg"
			sizes="(max-width: 1920px) 100vw"
		/>
		<div
			class="absolute top-0 left-0 -translate-y-full bg-black/50 px-2 py-1 text-xs text-white transition-transform duration-300 group-hover:translate-y-0 focus-within:translate-y-0"
		>
			Photo by <a
				href="https://unsplash.com/@lmasania?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
				>Lokesh B Masania</a
			>
			on
			<a
				href="https://unsplash.com/photos/a-tree-with-purple-flowers-in-front-of-a-building-UwkKj6461fw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
				>Unsplash</a
			>
		</div>
	</div>
	<div class="-translate-y-5 px-8">
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

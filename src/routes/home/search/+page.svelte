<script lang="ts">
	import type { PageProps } from './$types';
	import SearchForm from './search-form.svelte';
	import PostCard from '@/components/PostCard.svelte';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Button } from '@/components/ui/button';
	import { Skeleton } from '@/components/ui/skeleton';
	import { Label } from '@/components/ui/label';
	import PostDropdownMenu from '@/components/PostDropdownMenu.svelte';
	import Meta from '@/components/Meta.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data }: PageProps = $props();

	let globalTags = $state<string[]>([]);
	let userTags = $state<string[]>([]);
	$effect(() => {
		data.globalTagsData.then((tags) => (globalTags = tags));
		data.userTagsData.then((tags) => (userTags = tags));
	});

	function gotoPage(pageNum: number) {
		const params = page.url.searchParams;
		params.set('page', pageNum.toString());
		goto(`?${params.toString()}`, { invalidateAll: true, keepFocus: true });
	}
</script>

<Meta title="Search Research" description="Search for Astronomy Research Opportunities" />

<div class="container mx-auto pb-16">
	<div class="group relative w-full overflow-hidden">
		<enhanced:img
			alt="Sunset from May 15 2022 on Cerro Pachòn. An observatory on a mountain with a dramatic sunset behind it."
			class="max-h-32 w-full object-cover object-[50%_40%]"
			src="$lib/assets/imgs/LSST-Summit_Facility-Camera_1-May_15_2022_07_00_00_PM_1.jpg"
			sizes="(max-width: 1920px) 100vw"
		/>
		<div
			class="absolute top-0 left-0 -translate-y-full bg-black/50 px-2 py-1 text-xs text-white transition-transform duration-300 group-hover:translate-y-0 focus-within:translate-y-0"
		>
			Credit: RubinObs/NOIRLab/SLAC/NSF/DOE/AURA
		</div>
	</div>
	<div class="-translate-y-5 px-8">
		<SearchForm {globalTags} {userTags} />
	</div>

	<div class="mx-auto mb-4 flex max-w-4xl flex-col gap-4 px-4">
		{#await data.postData}
			<Skeleton class="mx-auto h-3.5 w-24" />
			<Skeleton class="h-48 w-full" />
			<Skeleton class="h-48 w-full" />
		{:then { posts, total }}
			<Label class="justify-center">
				{#if total === 0}
					No results found
				{:else}
					{total} result{total > 1 ? 's' : ''} found
				{/if}
			</Label>
			{#each posts as post}
				<PostCard {post} href={`/home/post/${post.id}`}>
					{#snippet action({ closed })}
						<Button href="/home/post/{post.id}" disabled={closed}>Apply</Button>
						<PostDropdownMenu {post} userId={data.user.id} isAdmin={data.isAdmin} />
					{/snippet}
				</PostCard>
			{/each}
		{/await}
	</div>

	{#await data.postData}
		<div class="flex justify-center">
			<Skeleton class="h-10 w-32" />
		</div>
	{:then { total }}
		{#if total > 0}
			<Pagination.Root
				count={total}
				perPage={25}
				page={parseInt(page.url.searchParams.get('page') || '1')}
				onPageChange={gotoPage}
			>
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

<script lang="ts">
	import type { PageProps } from './$types';
	import SearchForm from './search-form.svelte';
	import PostCard from '@/components/PostCard.svelte';
	import * as Pagination from '$lib/components/ui/pagination';

	let { data }: PageProps = $props();
</script>

<div class="container mx-auto">
	<div class="relative w-full">
		<div class="peer">
			<enhanced:img
				alt="Starry Mountain Background"
				class="max-h-32 w-full object-cover object-center"
				src="$lib/assets/imgs/benjamin-voros-phIFdC6lA4E-unsplash.jpg"
				sizes="(max-width: 1920px) 100vw"
			/>
		</div>
		<div
			class="absolute top-0 left-0 -translate-y-full bg-black/50 px-2 py-1 text-xs text-white transition-transform duration-300 peer-hover:translate-y-0"
		>
			Photo by <a
				href="https://unsplash.com/@vorosbenisop?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
				class="underline">Benjamin Voros</a
			>
			on
			<a
				href="https://unsplash.com/photos/snow-mountain-under-stars-phIFdC6lA4E?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
				class="underline">Unsplash</a
			>
		</div>
	</div>
	<div class="-translate-y-5 px-8">
		<SearchForm />
	</div>
	<div class="max-w-4xl mx-auto mb-4 flex flex-col gap-4 px-8">
		{#each data.posts as post}
			<PostCard post={post} />
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
</div>

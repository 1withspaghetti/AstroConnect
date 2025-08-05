<script lang="ts">
	import PostCard from '@/components/PostCard.svelte';
	import type { PageProps } from './$types';
	import { Button } from '@/components/ui/button';
	import Pen from '@lucide/svelte/icons/pen';
	import { Separator } from '@/components/ui/separator';

	let { data }: PageProps = $props();
</script>

<div class="mx-auto max-w-4xl px-4 pb-16">
	<div class="flex items-end justify-between">
		<h1 class="mt-8 text-2xl font-bold">Published</h1>
		<Button variant="outline" href="/dashboard/drafts">
			<Pen />
			View Drafts
		</Button>
	</div>
	<Separator class="mt-1 mb-4" />
	<div class="mx-auto mb-4 flex max-w-4xl flex-col gap-4 px-2">
		{#await data.posts}
			<p class="text-muted-foreground">Loading drafts...</p>
		{:then posts}
			{#each posts as post}
				<PostCard {post} href={`/dashboard/post/${post.id}`}>
					{#snippet action()}
						<Button href={`/dashboard/post/${post.id}/edit/description`}>
							<Pen />
							Edit
						</Button>
					{/snippet}
				</PostCard>
			{/each}
		{:catch error}
			<p class="text-red-500">Error loading drafts: {error.message}</p>
		{/await}
	</div>
</div>

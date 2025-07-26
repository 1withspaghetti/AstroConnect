<script lang="ts">
	import PostCard from '@/components/PostCard.svelte';
	import type { PageProps } from './$types';
	import { Button } from '@/components/ui/button';
	import Pen from '@lucide/svelte/icons/pen';
	import { Separator } from '@/components/ui/separator';
	import Plus from '@lucide/svelte/icons/plus';

	let { data }: PageProps = $props();
</script>

<div class="mx-auto max-w-4xl px-4 pb-16">
	<div class="flex items-end justify-between">
		<h1 class="mt-8 text-2xl font-bold">Drafts</h1>
		<Button>
			<Plus />
			New Draft
		</Button>
	</div>
	<Separator class="mt-1 mb-4" />
	<div class="mx-auto mb-4 flex max-w-4xl flex-col gap-4 px-2">
		{#each data.posts as post}
			<PostCard {post} href={`/dashboard/post/${post.id}`}>
				{#snippet action()}
					<Button href={`/dashboard/post/${post.id}/edit/description`}>
						<Pen />
						Edit
					</Button>
				{/snippet}
			</PostCard>
		{/each}
	</div>
</div>

<script lang="ts">
	import type { PostPreview } from '@/types/post';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '@/components/ui/button';
	import ImagesIcon from '@lucide/svelte/icons/images';
	import Tag from './ui/Tag.svelte';

	let { post }: { post: PostPreview } = $props();
</script>

<div class="bg-card text-card-foreground flex rounded-xl border shadow-sm">
	{#if post.images && post.images.length > 0}
		<div class="relative">
			<img
				src={post.images[0]}
				alt={post.title}
				class="h-full w-24 rounded-l-xl object-cover object-center sm:w-48"
			/>
			<a
				title="View more images"
				href="/dashboard/post/{post.id}"
				class="absolute right-0 bottom-0 flex cursor-pointer items-center gap-1 rounded-tl-lg bg-black/50 p-2 text-xs text-white transition hover:bg-black/70"
			>
				<ImagesIcon class="h-4 w-4" />
				More...
			</a>
		</div>
	{/if}
	<div class="flex flex-1 flex-col gap-4 py-4">
		<Card.Header>
			<Card.Title class="line-clamp-2">{post.title}</Card.Title>
			<Card.Description class="line-clamp-3"
				>{post.desc || 'No description provided.'}</Card.Description
			>
			<Card.Action>
				<Button href="/dashboard/post/{post.id}" disabled={!post.open}
					>Apply {post.open ? '' : '(Closed)'}</Button
				>
			</Card.Action>
		</Card.Header>
		<Card.Content class="flex flex-1 flex-col gap-2">
			{#if post.careerStage}
				<div class="text-muted-foreground line-clamp-1 text-sm">
					<strong>Recommended Career Stage:</strong>
					{post.careerStage}
				</div>
			{/if}
			{#if post.prereq}
				<div class="text-muted-foreground line-clamp-1 text-sm">
					<strong>Prerequisite:</strong>
					{post.prereq}
				</div>
			{/if}
		</Card.Content>
		<Card.Footer class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
			<div class="flex flex-wrap gap-2">
				{#each post.tags as tag}
					<Tag>{tag}</Tag>
				{/each}
			</div>
			<div class="text-muted-foreground text-xs sm:text-right">
				<span
					>Posted <b title={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</b> by {post
						.createdBy.name} (<a
						href={`mailto:${post.createdBy.email}`}
						target="_blank"
						class="underline">{post.createdBy.email}</a
					>)</span
				>
			</div>
		</Card.Footer>
	</div>
</div>

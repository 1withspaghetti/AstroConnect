<script lang="ts">
	import type { PostPreview } from '@/types/post';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '@/components/ui/button';
	import ImagesIcon from '@lucide/svelte/icons/images';
	import dayjs from '@/util/dayjs';
	import { Badge } from '$lib/components/ui/badge';

	let { post }: { post: PostPreview } = $props();

	let closed = $derived(
		!post.open ||
			(post.closesAt && dayjs(post.closesAt).isBefore(dayjs())) ||
			(post.slotsRemaining !== undefined && post.slotsRemaining <= 0)
	);
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
			<Card.Title class="line-clamp-2"
				><a href="/dashboard/post/{post.id}">{post.title}</a></Card.Title
			>
			<Card.Description class="line-clamp-3"
				>{post.desc || 'No description provided.'}</Card.Description
			>
			<Card.Action>
				<Button href="/dashboard/post/{post.id}" disabled={closed}>Apply</Button>
			</Card.Action>
		</Card.Header>
		<Card.Content class="flex flex-1 flex-col">
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
			<div class="mt-2 flex flex-wrap gap-2">
				{#each post.tags as tag}
					<Badge>{tag}</Badge>
				{/each}
			</div>
		</Card.Content>
		<Card.Footer class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
			{#if !closed && (post.closesAt !== undefined || post.slotsRemaining !== undefined)}
				<div class="text-muted-foreground mb-2 w-full text-sm italic">
					Closes
					{#if post.closesAt !== undefined}
						in
						<span
							title={dayjs(post.closesAt).format('LLLL')}
							class={dayjs(post.closesAt).isBefore(dayjs().add(1, 'day')) ? 'text-red-500' : ''}
						>
							{dayjs().to(post.closesAt, true)}
						</span>
					{/if}
					{#if post.closesAt !== undefined && post.slotsRemaining !== undefined}
						<span>or</span>
					{/if}
					{#if post.slotsRemaining !== undefined}
						after
						<span class={post.slotsRemaining > 5 ? '' : 'text-red-500'}>
							{post.slotsRemaining} more application{post.slotsRemaining !== 1 ? 's' : ''}
						</span>
					{/if}
				</div>
			{:else if closed}
				<div class="mb-2 line-clamp-1 w-full text-sm text-red-500">
					<strong>No longer accepting applications</strong>
				</div>
			{:else}
				<div class="w-full"></div>
			{/if}
			<div class="text-muted-foreground text-xs sm:text-right">
				<span
					>Posted <b title={dayjs(post.createdAt).format('LLLL')}
						>{dayjs(post.createdAt).fromNow()}</b
					>
					by {post.createdBy.name} (<a
						href={`mailto:${post.createdBy.email}`}
						target="_blank"
						class="underline">{post.createdBy.email}</a
					>)</span
				>
			</div>
		</Card.Footer>
	</div>
</div>

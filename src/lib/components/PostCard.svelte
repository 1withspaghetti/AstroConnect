<script lang="ts">
	import type { PostPreview } from '@/types/post';
	import * as Card from '$lib/components/ui/card';
	import ImagesIcon from '@lucide/svelte/icons/images';
	import dayjs from '@/util/dayjs';
	import { Badge } from '$lib/components/ui/badge';
	import type { Snippet } from 'svelte';

	let {
		post,
		href,
		action
	}: {
		post: PostPreview;
		href: string;
		action?: Snippet<[{ closed: boolean }]>;
	} = $props();

	let closed = $derived(
		!post.isOpen ||
			(post.closesAt && dayjs(post.closesAt).isBefore(dayjs())) ||
			(post.maxSlots !== null && post.maxSlots <= post.applications)
	);
</script>

<div class="bg-card text-card-foreground @container flex rounded-xl border shadow-sm">
	{#if post.images && post.images.length > 0}
		<div class="relative">
			<img
				src={post.images[0]}
				alt={post.title}
				class="h-full w-24 rounded-l-xl object-cover object-center @lg:w-48"
			/>
			<a
				title="View more images"
				{href}
				class="absolute right-0 bottom-0 flex cursor-pointer items-center gap-1 rounded-tl-lg bg-black/50 p-2 text-xs text-white transition hover:bg-black/70"
			>
				<ImagesIcon class="h-4 w-4" />
				More...
			</a>
		</div>
	{/if}
	<div class="flex flex-1 flex-col gap-4 py-4">
		<Card.Header>
			<Card.Title class="line-clamp-2 pb-1"><a {href}>{post.title}</a></Card.Title>
			<Card.Description class="line-clamp-3"
				>{post.desc || 'No description provided.'}</Card.Description
			>
			{#if action}
				<Card.Action class="flex items-center gap-1">
					{@render action?.({ closed })}
				</Card.Action>
			{/if}
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
		<Card.Footer class="flex flex-col items-start justify-between gap-2 @lg:flex-row @lg:items-end">
			{#if !closed && (post.closesAt !== undefined || post.maxSlots !== null)}
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
					{#if post.closesAt !== undefined && post.maxSlots !== null}
						<span>or</span>
					{/if}
					{#if post.maxSlots !== null}
						after
						<span class={post.maxSlots - post.applications > 5 ? '' : 'text-red-500'}>
							{post.maxSlots - post.applications} more application{post.maxSlots -
								post.applications !==
							1
								? 's'
								: ''}
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
			<div class="text-muted-foreground text-xs @lg:text-right">
				<span
					>Posted <b title={dayjs(post.createdAt).format('LLLL')}
						>{dayjs(post.createdAt).fromNow()}</b
					>
					by {post.owner.name} (<a
						href={`mailto:${post.owner.email}`}
						target="_blank"
						class="underline">{post.owner.email}</a
					>)</span
				>
			</div>
		</Card.Footer>
	</div>
</div>

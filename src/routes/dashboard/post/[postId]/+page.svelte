<script lang="ts">
	import type { PageProps } from './$types';
	import ImageCarousel from './image-carousel.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '@/components/ui/avatar';
	import Mail from '@lucide/svelte/icons/mail';
	import Tag from '@/components/ui/Tag.svelte';
	import dayjs from '@/util/dayjs';

	let { data }: PageProps = $props();

	let post = data.post;

	let closed = $derived(
		!post.open ||
			(post.closesAt && dayjs(post.closesAt).isBefore(dayjs())) ||
			(post.slotsRemaining !== undefined && post.slotsRemaining <= 0)
	);
</script>

<div class="container mx-auto">
	<div class="mx-auto w-full max-w-4xl px-4">
		<h1 class="mt-8 mb-4 text-2xl font-bold sm:px-4">{post.title}</h1>
		<ImageCarousel images={post.images} />
		<div class="mt-4 sm:px-4">
			<p class="mb-8 indent-4">{post.desc || 'No description provided.'}</p>
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div>
					{#if post.careerStage}
						<div>
							<strong>Recommended Career Stage:</strong>
							{post.careerStage}
						</div>
					{/if}
					{#if post.prereq}
						<div>
							<strong>Prerequisite:</strong>
							{post.prereq}
						</div>
					{/if}
					<div class="mt-2 mb-4 flex flex-wrap gap-2">
						{#each post.tags as tag}
							<Tag>{tag}</Tag>
						{/each}
					</div>
					{#if !closed && (post.closesAt !== undefined || post.slotsRemaining !== undefined)}
						<div class="mb-2 italic">
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
						<div class="mb-2 text-red-500">
							<strong>No longer accepting applications</strong>
						</div>
					{/if}
					<div class="mt-2 text-sm">
						Posted
						<span title={dayjs(post.createdAt).format('LLLL')}
							>{dayjs(post.createdAt).fromNow()}</span
						>
					</div>
				</div>
				<Card.Root class="max-w-sm">
					<Card.Content class="flex flex-col items-center gap-2">
						<Avatar.Root class="">
							<Avatar.Image src={post.createdBy.pfp} alt={post.createdBy.name} />
							<Avatar.Fallback>{post.createdBy.name[0] || '?'}</Avatar.Fallback>
						</Avatar.Root>
						<Card.Title class="line-clamp-1">{post.createdBy.name}</Card.Title>
						<div class="text-muted-foreground flex items-center text-sm">
							<Mail class="mr-1 h-4 w-4" />
							<a href={`mailto:${post.createdBy.email}`} target="_blank" class="underline"
								>{post.createdBy.email}</a
							>
						</div>
						<div class="text-muted-foreground text-sm mt-2">
							{post.createdBy.bio || 'No bio provided.'}
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</div>

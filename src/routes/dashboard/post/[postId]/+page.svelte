<script lang="ts">
	import type { PageProps } from './$types';
	import ImageCarousel from './image-carousel.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '@/components/ui/avatar';
	import Mail from '@lucide/svelte/icons/mail';
	import Tag from '@/components/ui/Tag.svelte';

	let { data }: PageProps = $props();

	let post = data.post;
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
					<div class="mt-2 flex flex-wrap gap-2">
						{#each post.tags as tag}
							<Tag>{tag}</Tag>
						{/each}
					</div>
					<div class="mt-2 text-sm">
						Posted:
						<span title={post.createdAt}>{new Date(post.createdAt).toLocaleString()}</span>
					</div>
				</div>
				<Card.Root class="max-w-sm">
					<Card.Content class="flex flex-col items-center gap-2">
						<Avatar.Root class="">
							<Avatar.Image src={post.createdBy.pfp} alt={post.createdBy.name} />
							<Avatar.Fallback>{post.createdBy.name[0] || '?'}</Avatar.Fallback>
						</Avatar.Root>
						<Card.Title class="line-clamp-1">{post.createdBy.name}</Card.Title>
						<Card.Description>
							<div class="text-muted-foreground flex items-center text-sm">
								<Mail class="mr-1 h-4 w-4" />
								<a href={`mailto:${post.createdBy.email}`} target="_blank" class="underline"
									>{post.createdBy.email}</a
								>
							</div>
							<div class="text-muted-foreground mt-4">
								{post.createdBy.bio || 'No bio provided.'}
							</div>
						</Card.Description>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</div>

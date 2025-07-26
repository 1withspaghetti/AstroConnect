<script lang="ts">
	import ImageCarousel from '$lib/components/ui/ImageCarousel.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '@/components/ui/avatar';
	import Mail from '@lucide/svelte/icons/mail';
	import dayjs from '@/util/dayjs';
	import { Separator } from '@/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import ApplicationForm from '@/components/ApplicationForm.svelte';
	import type { Post } from '@/types/post';
	import type { Infer, SuperValidated } from 'sveltekit-superforms/client';
	import type { getApplicationFormSchema } from '@/validators/applicationFormValidator';

	let {
		post,
		formInputData,
		allowSubmit
	}: {
		post: Post;
		formInputData?: SuperValidated<Infer<ReturnType<typeof getApplicationFormSchema>>>;
		allowSubmit: boolean;
	} = $props();

	let closed = $derived(
		!post.open ||
			(post.closesAt && dayjs(post.closesAt).isBefore(dayjs())) ||
			(post.slotsRemaining !== undefined && post.slotsRemaining <= 0)
	);
</script>

<div class="mx-auto w-full max-w-4xl px-4 pb-16">
	<h1 class="mt-8 text-2xl font-bold">{post.title}</h1>
	<Separator class="mt-1 mb-4" />

	<ImageCarousel images={post.images} />
	<p class="my-8 indent-4">{post.desc || 'No description provided.'}</p>
	<div class="mb-4 flex flex-wrap items-start justify-between gap-4">
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
					<Badge>{tag}</Badge>
				{/each}
			</div>
			<div class="mt-2 mb-4 text-sm">
				Posted
				<span title={dayjs(post.createdAt).format('LLLL')}>{dayjs(post.createdAt).fromNow()}</span>
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
				<div class="text-muted-foreground mt-2 text-sm">
					{post.createdBy.bio || 'No bio provided.'}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<h2 class="text-2xl font-bold">Apply</h2>
	<Separator class="mt-1 mb-6" />
	<div class="px-2">
		{#if post.applicationForm}
			<ApplicationForm
				formDefinition={post.applicationForm}
				{formInputData}
				disabled={closed}
				{allowSubmit}
			/>
		{/if}
	</div>
</div>

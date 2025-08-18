<script lang="ts">
	import ImageCarousel from '$lib/components/ui/ImageCarousel.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '@/components/ui/avatar';
	import Mail from '@lucide/svelte/icons/mail';
	import dayjs from '@/util/dayjs';
	import { Separator } from '@/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import ApplicationForm from './ApplicationForm.svelte';
	import type { Post } from '@/types/post';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
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
		!post.isOpen ||
			(post.closesAt !== null && dayjs(post.closesAt).isBefore(dayjs())) ||
			(post.maxSlots !== null && post.maxSlots <= post.applications)
	);
</script>

<div class="mx-auto w-full max-w-4xl px-4 pb-16">
	<h1 class="mt-8 text-2xl font-bold">{post.title}</h1>
	<Separator class="mt-1 mb-4" />

	{#if post.images.length > 0}
		<ImageCarousel images={post.images} />
	{/if}
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
			{#if !closed && (post.closesAt !== null || post.maxSlots !== null)}
				<div class="mb-2 italic">
					Closes
					{#if post.closesAt !== null}
						in
						<span
							title={dayjs(post.closesAt).format('LLLL')}
							class={dayjs(post.closesAt).isBefore(dayjs().add(1, 'day')) ? 'text-red-500' : ''}
						>
							{dayjs().to(post.closesAt, true)}
						</span>
					{/if}
					{#if post.closesAt !== null && post.maxSlots !== null}
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
				<div class="mb-2 text-red-500">
					<strong>No longer accepting applications</strong>
				</div>
			{/if}
		</div>
		<Card.Root class="max-w-sm">
			<Card.Content class="flex flex-col items-center gap-2">
				<Avatar.Root class="size-12">
					<Avatar.Image src={post.owner.pfp} alt={post.owner.name} />
					<Avatar.Fallback>{post.owner.name[0] || '?'}</Avatar.Fallback>
				</Avatar.Root>
				<Card.Title class="line-clamp-1 pb-1">{post.owner.name}</Card.Title>
				<div class="text-muted-foreground flex items-center text-sm">
					<Mail class="mr-1 h-4 w-4" />
					<a href={`mailto:${post.owner.email}`} target="_blank" class="underline"
						>{post.owner.email}</a
					>
				</div>
				<div class="text-muted-foreground mt-2 text-sm">
					{post.owner.bio || 'No bio provided.'}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<h2 class="text-2xl font-bold">Apply</h2>
	<Separator class="mt-1 mb-6" />
	<div class="px-2">
		<ApplicationForm
			formQuestions={post.questions}
			{formInputData}
			disabled={closed}
			{allowSubmit}
		/>
	</div>
</div>

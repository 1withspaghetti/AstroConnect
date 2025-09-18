<script lang="ts">
	import ImageCarousel from '$lib/components/ui/ImageCarousel.svelte';
	import dayjs from '@/util/dayjs';
	import { Separator } from '@/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import ApplicationForm from './ApplicationForm.svelte';
	import type { Post } from '@/types/post';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { getApplicationFormSchema } from '@/validators/applicationFormValidator';
	import UserCard from '@/components/UserCard.svelte';
	import PostDropdownMenu from '@/components/PostDropdownMenu.svelte';

	let {
		post,
		formInputData,
		allowSubmit,
		isAdmin
	}: {
		post: Post;
		formInputData?: SuperValidated<Infer<ReturnType<typeof getApplicationFormSchema>>>;
		allowSubmit: boolean;
		isAdmin: boolean;
	} = $props();

	let closed = $derived(
		!post.isOpen ||
			(post.closesAt !== null && dayjs(post.closesAt).isBefore(dayjs())) ||
			(post.maxSlots !== null && post.maxSlots <= post.applications)
	);
</script>

<div class="mx-auto w-full max-w-4xl px-4 pb-16">
	<div class="flex items-end justify-between">
		<h1 class="mt-8 text-2xl font-bold">{post.title}</h1>
		<PostDropdownMenu {post} {isAdmin} />
	</div>
	<Separator class="mt-1 mb-4" />

	{#if post.images.length > 0}
		<ImageCarousel images={post.images} />
	{/if}
	<p class="my-8 indent-4">{post.desc || 'No description provided.'}</p>
	<div class="mb-4 flex flex-wrap items-start justify-between gap-4">
		<div>
			{#if post.positions}
				<div>
					<strong>Positions Available:</strong>
					{post.positions}
				</div>
			{/if}
			{#if post.timeCommitment}
				<div>
					<strong>Time Commitment:</strong>
					{post.timeCommitment}
				</div>
			{/if}
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
			{#if post.durationStart && post.durationEnd}
				<div>
					<strong>Estimated Date Range:</strong>
					{dayjs(post.durationStart, 'YYYY-MM-DD').format('ll')}
					to
					{dayjs(post.durationEnd, 'YYYY-MM-DD').format('ll')}
				</div>
			{/if}
			<div class="mt-2 flex flex-wrap gap-2">
				{#each post.tags as tag}
					<Badge>{tag}</Badge>
				{/each}
			</div>
			<div class="mt-2 mb-4 text-sm">
				Posted
				<span title={dayjs(post.publishedAt || post.createdAt).format('LLLL')}
					>{dayjs(post.publishedAt || post.createdAt).fromNow()}</span
				>
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
		<UserCard user={post.owner} {isAdmin} />
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

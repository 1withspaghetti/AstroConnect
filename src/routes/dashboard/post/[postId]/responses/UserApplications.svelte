<script lang="ts">
	import type { UserProfile } from '@/types/user';
	import type { PageProps } from './$types';
	import UserCard from '@/components/UserCard.svelte';
	import * as Pagination from '$lib/components/ui/pagination';
	import { fly } from 'svelte/transition';
	import dayjs from '@/util/dayjs';
	import { Separator } from '@/components/ui/separator';
	import { ApplicationFormQuestionType } from '@/types/applicationForm';
	import Button from '@/components/ui/button/button.svelte';
	import FileDown from '@lucide/svelte/icons/file-down';

	let {
		user,
		applications,
		isAdmin
	}: { user: UserProfile; applications: PageProps['data']['applications']; isAdmin: boolean } =
		$props();

	// svelte-ignore state_referenced_locally
	let prev = $state(applications.length + 1);
	// svelte-ignore state_referenced_locally
	let page = $state(applications.length);

	function onPageChange(value: number) {
		prev = page;
		page = value;
	}

	function getFileName(url: string) {
		const file =
			url.match(/^https?:\/\/[\da-z.-]+\.[a-z.]{2,6}\/[0-9a-fA-F-]+\/\w+-(.+)$/)?.[1] || 'File';
		return decodeURIComponent(decodeURIComponent(file));
	}
</script>

<UserCard {user} {isAdmin} />
<div class="w-full flex flex-col items-center mb-4">
	<div class="relative w-full h-full overflow-hidden">
		{#key page}
			{@const app = applications[page - 1]}
			<div
				in:fly={{ x: prev < page ? 250 : -250 }}
				out:fly={{ x: prev < page ? -250 : 250 }}
				onoutrostart={(e) => e.currentTarget.classList.add('absolute', 'w-full', 'h-full')}
			>
				<div class="flex items-end justify-between">
					<h3 id="app:{app.id}" class="font-bold text-lg">
						Application {#if applications.length > 1}#{page}{/if}
					</h3>
					<span
						class="text-muted-foreground ml-2 text-xs"
						title={dayjs(app.createdAt).format('LLLL')}
					>
						{dayjs(app.createdAt).fromNow()}
					</span>
				</div>
				<Separator class="mt-1 mb-4" />
				{#each app.answers as answer, i (i)}
					<h4 id="app:{app.id}:answer:{i}" class="mb-2 text-sm leading-snug font-medium">
						{answer.label}
					</h4>
					<div class="mb-6 ml-4">
						{#if answer.type === ApplicationFormQuestionType.FILE}
							{#if answer.answer}
								<Button href={answer.answer as string} variant="secondary">
									<FileDown />
									<span>{getFileName(answer.answer as string)}</span>
								</Button>
							{:else}
								<span class="text-muted-foreground italic">No file provided</span>
							{/if}
						{:else}
							<p
								class="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none"
							>
								{Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		{/key}
	</div>
	{#if applications.length > 1}
		<Pagination.Root count={applications.length} {page} {onPageChange} perPage={1} siblingCount={2}>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Previous />
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.Next />
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/if}
</div>

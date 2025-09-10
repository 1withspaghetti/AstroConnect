<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import type { PageProps } from './$types';
	import * as Accordion from '@/components/ui/accordion';
	import dayjs from '@/util/dayjs';
	import { ApplicationFormQuestionType } from '@/types/applicationForm';
	import PostCard from '@/components/PostCard.svelte';
	import { Separator } from '@/components/ui/separator';
	import { page } from '$app/state';
	import { idValidator } from '@/validators/idValidator';

	let { data }: PageProps = $props();

	let open = $state<string[]>([]);

	$effect(() => {
		if (page.url.hash && idValidator.safeParse(page.url.hash.slice(1)).success) {
			open = [page.url.hash.slice(1)];
			document.getElementById(page.url.hash.slice(1))?.scrollIntoView();
		} else {
			open = [];
		}
	});
</script>

<Meta title="Applications" />

<div class="mx-auto max-w-6xl px-4 pb-16">
	<div class="flex items-end justify-between">
		<h1 class="mt-8 text-2xl font-bold">My Applications</h1>
	</div>
	<Separator class="mt-1 mb-4" />
	<Accordion.Root type="multiple" class="mt-8 mb-4 px-4" bind:value={open}>
		{#each data.applications as app}
			<Accordion.Item value={`app:${app.id}`} class="@container">
				<Accordion.Trigger
					id={app.id}
					class="bg-accent/50 hover:bg-accent data-[state=open]:bg-accent/70 items-center gap-2 px-4 py-4 hover:no-underline"
				>
					<div class="flex items-center gap-2">
						<span class="font-medium">{app.post.title}</span>
						<span
							title={dayjs(app.createdAt).format('LLLL')}
							class="text-muted-foreground ml-2 text-xs"
						>
							Applied {dayjs(app.createdAt).fromNow()}
						</span>
					</div>
				</Accordion.Trigger>
				<Accordion.Content class="flex flex-col gap-4 p-2">
					<PostCard post={app.post} href={`/home/post/${app.post.id}`} />
					<ol>
						{#each app.answers as answer}
							<li class="space-y-2">
								<b class="mb-2">{answer.label}:</b>
								<p class="indent-4">
									{#if answer.type === ApplicationFormQuestionType.FILE}
										{@const filename = new URL(answer.answer as string).pathname.split('/').pop()}
										<a
											target="_blank"
											href={answer.answer as string}
											class="text-blue-500 underline">{filename || 'View File'}</a
										>
									{:else if Array.isArray(answer.answer)}
										{answer.answer.join(', ')}
									{:else}
										{answer.answer}
									{/if}
								</p>
							</li>
						{/each}
					</ol>
					<p class="text-muted-foreground text-sm">
						Submitted on {dayjs(app.createdAt).format('LLLL')}
					</p>
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</div>

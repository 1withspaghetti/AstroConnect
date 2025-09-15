<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import type { PageProps } from './$types';
	import AcceptingResponsesForm from './AcceptingResponsesForm.svelte';
	import * as Accordion from '@/components/ui/accordion';
	import UserCard from '@/components/UserCard.svelte';
	import { ApplicationFormQuestionType } from '@/types/applicationForm';
	import UserAvatar from '@/components/UserAvatar.svelte';
	import dayjs from '@/util/dayjs';
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

<Meta title="Responses" />

<div class="container mx-auto mt-4 pb-16">
	<AcceptingResponsesForm formInputData={data.form} />
	<Accordion.Root type="multiple" class="mx-auto mt-8 mb-4 max-w-6xl px-4" bind:value={open}>
		{#each data.applications as app}
			<Accordion.Item value={`app:${app.id}`} class="@container">
				<Accordion.Trigger
					id={app.id}
					class="bg-accent/50 hover:bg-accent data-[state=open]:bg-accent/70 items-center gap-2 px-4 py-4 hover:no-underline"
				>
					<div class="flex items-center gap-2">
						<UserAvatar user={app.user} class="size-8" />
						<span class="font-medium"
							>{app.user.name} (<a
								href={`mailto:${app.user.email}`}
								class="text-muted-foreground underline">{app.user.email}</a
							>)</span
						>
						<span
							title={dayjs(app.createdAt).format('LLLL')}
							class="text-muted-foreground ml-2 text-xs"
						>
							Applied {dayjs(app.createdAt).fromNow()}
						</span>
					</div>
				</Accordion.Trigger>
				<Accordion.Content class="flex flex-col gap-4 p-2 @2xl:flex-row">
					<UserCard user={app.user} isAdmin={data.isAdmin} />
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
		{:else}
			<p class="mt-16 text-center text-muted-foreground text-sm">
				No one has applied to your post yet.
			</p>
		{/each}
	</Accordion.Root>
</div>

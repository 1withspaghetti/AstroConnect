<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import type { PageProps } from './$types';
	import * as Accordion from '@/components/ui/accordion';
	import UserAvatar from '@/components/UserAvatar.svelte';
	import dayjs from '@/util/dayjs';
	import { page } from '$app/state';
	import { idValidator } from '@/validators/idValidator';
	import { Button } from '@/components/ui/button';
	import Pen from '@lucide/svelte/icons/pen';
	import { Separator } from '@/components/ui/separator';
	import PostDropdownMenu from '@/components/PostDropdownMenu.svelte';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import type { UserProfile } from '@/types/user';
	import UserApplications from './UserApplications.svelte';

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

	let groupedApps = $derived(
		data.applications.reduce(
			(users, app) => {
				const existing = users.find((user) => user.user.id == app.user.id);
				if (existing) existing.applications.push(app);
				else users.push({ user: app.user, applications: [app] });
				return users;
			},
			[] as { user: UserProfile; applications: typeof data.applications }[]
		)
	);
</script>

<Meta title="Responses" />

<div class="mx-auto w-full max-w-6xl px-4 pb-16">
	<div class="flex items-end justify-between">
		<h1 id="responses" class="mt-8 line-clamp-1 text-2xl font-bold">Responses</h1>
		<div class="flex gap-2">
			<Button variant="default" href="/dashboard/post/{data.postId}/edit">
				<Pen />
				Edit Form
			</Button>
			<PostDropdownMenu
				post={data.post}
				userId={data.user.id}
				isAdmin={data.isAdmin}
				hasAccessToEditOverride
			/>
		</div>
	</div>
	<Separator class="mt-1 mb-4" />

	<Accordion.Root type="multiple" class="mx-auto mt-8 mb-4 max-w-6xl" bind:value={open}>
		{#each groupedApps as { user, applications } (user.id)}
			<Accordion.Item value={user.id} class="@container group">
				<Accordion.Trigger
					id={user.id}
					class="bg-accent/50 hover:bg-accent data-[state=open]:bg-accent/70 items-center gap-2 px-4 py-4 hover:no-underline rounded-none group-first:rounded-t-md group-last:rounded-b-md"
				>
					<div class="flex items-center gap-2">
						<UserAvatar {user} class="size-8" />
						<span class="font-medium"
							>{user.name} (<a href={`mailto:${user.email}`} class="text-muted-foreground underline"
								>{user.email}</a
							>)</span
						>
						<span class="text-muted-foreground ml-2 text-xs">
							Applied <span
								title={dayjs(applications[applications.length - 1].createdAt).format('LLLL')}
								class="underline"
								>{dayjs(applications[applications.length - 1].createdAt).fromNow()}</span
							>{#if applications.length > 1}, then {#if applications.length == 2}again{:else}recently{/if}
								<span title={dayjs(applications[0].createdAt).format('LLLL')} class="underline"
									>{dayjs(applications[0].createdAt).fromNow()}</span
								>{/if}
							{#if applications.length > 2}({applications.length} total applications){/if}
						</span>
					</div>
				</Accordion.Trigger>
				<Accordion.Content class="w-full flex flex-col items-start gap-4 p-2 @2xl:flex-row">
					<UserApplications {user} {applications} isAdmin={data.isAdmin} />
				</Accordion.Content>
			</Accordion.Item>
		{:else}
			<p class="mt-16 text-center text-muted-foreground text-sm">
				No one has applied to your post yet. {#if data.isDraft}Make sure to publish it using the
					three dots (<Ellipsis class="inline size-4" />) above so people can see it!{/if}
			</p>
		{/each}
	</Accordion.Root>
</div>

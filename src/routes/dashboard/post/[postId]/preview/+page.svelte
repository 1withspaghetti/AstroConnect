<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import PostPage from '../../../../home/post/[postId]/PostPage.svelte';
	import type { PageProps } from './$types';
	import { Separator } from '@/components/ui/separator';
	import { Button } from '@/components/ui/button';
	import Pen from '@lucide/svelte/icons/pen';
	import PostDropdownMenu from '@/components/PostDropdownMenu.svelte';

	let { data }: PageProps = $props();
</script>

<Meta title="Preview" />

<div class="mx-auto w-full max-w-6xl px-4">
	<div class="flex items-end justify-between">
		<h1 id="preview" class="mt-8 line-clamp-1 text-2xl font-bold">
			Preview {#if data.post.isDraft}<span class="text-muted-foreground">(Draft)</span>{/if}
		</h1>
		<div class="flex gap-2">
			<Button variant="default" href="/dashboard/post/{data.post.id}/edit">
				<Pen />
				Edit
			</Button>
			<PostDropdownMenu
				post={data.post}
				userId={data.user.id}
				isAdmin={data.isAdmin}
				hasAccessToEditOverride
			/>
		</div>
	</div>
	<Separator class="mt-1 mb-12" />
</div>
<main class="container mx-auto">
	<PostPage post={data.post} allowSubmit={false} userId={data.user.id} isAdmin={false} />
</main>

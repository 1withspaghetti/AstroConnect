<script lang="ts">
	import type { PostPreview } from "@/types/post";
    import * as Card from '$lib/components/ui/card';
    import { Button } from '@/components/ui/button';
    import Images from '@lucide/svelte/icons/Images';

    let { post }: { post: PostPreview } = $props();
</script>

<div class="bg-card text-card-foreground flex rounded-xl border shadow-sm">
    {#if post.images && post.images.length > 0}
        <div class="relative">
            <img
                src={post.images[0]}
                alt={post.title}
                class="rounded-l-xl object-cover object-center w-24 sm:w-48 h-full"
            />
            <a title="View more images" href="./" class="absolute bottom-0 right-0 bg-black/50 p-2 text-xs text-white flex items-center gap-1 cursor-pointer rounded-tl-lg hover:bg-black/70 transition">
                <Images class="h-4 w-4" />
                More...
            </a>
        </div>
    {/if}
    <div class="flex flex-1 flex-col gap-4 py-4">
        <Card.Header>
            <Card.Title class="line-clamp-2">{post.title}</Card.Title>
            <Card.Description class="line-clamp-3">{post.desc || "No description provided."}</Card.Description>
            <Card.Action>
                <Button disabled={!post.open}>Apply {post.open ? '' : '(Closed)'}</Button>
            </Card.Action>
        </Card.Header>
        <Card.Content class="flex flex-col gap-2 flex-1">
            {#if post.experience}
                <div class="text-sm text-muted-foreground line-clamp-1">
                    <strong>Experience Level:</strong> {post.experience}
                </div>
            {/if}
            {#if post.prereq}
                <div class="text-sm text-muted-foreground line-clamp-1">
                    <strong>Prerequisite:</strong> {post.prereq}
                </div>
            {/if}
        </Card.Content>
        <Card.Footer class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
            <div class="flex flex-wrap gap-2">
                {#each post.tags as tag}
                    <span
                        class="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs font-semibold"
                    >
                        {tag}
                    </span>
                {/each}
            </div>
            <div class="text-muted-foreground text-xs sm:text-right">
                <span>Posted <b title={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</b> by {post.createdBy.name} (<a href={`mailto:${post.createdBy.email}`} class="underline">{post.createdBy.email}</a>)</span>
            </div>
        </Card.Footer>
    </div>
</div>
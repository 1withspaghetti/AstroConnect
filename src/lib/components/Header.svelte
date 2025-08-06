<script lang="ts">
	import Button from './ui/button/button.svelte';
	import Search from '@lucide/svelte/icons/search';
	import FileUp from '@lucide/svelte/icons/file-up';
	import HeaderProfile from './HeaderProfile.svelte';
	import type { UserPreview } from '@/types/user';

	const { user }: { user: UserPreview } = $props();
</script>

<div class="bg-background sticky top-0 z-40 border-b">
	<div class="container mx-auto flex items-center justify-between px-4 py-4">
		<h1 class="text-2xl font-light tracking-wider">AstroConnect</h1>
		<nav class="flex space-x-4">
			<Button href="/home/search" variant="default"
				><Search /> <span class="hidden sm:inline">Search for Research</span></Button
			>
			<Button href="/dashboard/drafts" variant="outline"
				><FileUp /> <span class="hidden sm:inline">Post Research</span></Button
			>
			<HeaderProfile {user} />
		</nav>
	</div>
</div>

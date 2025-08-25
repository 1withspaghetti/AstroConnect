<script lang="ts">
	import Button from '../../lib/components/ui/button/button.svelte';
	import Search from '@lucide/svelte/icons/search';
	import HeaderProfile from './HeaderProfile.svelte';
	import type { UserPreview } from '@/types/user';
	import Users from '@lucide/svelte/icons/users';

	const { user, isAdmin }: { user: UserPreview; isAdmin: boolean } = $props();
</script>

<div class="bg-background sticky top-0 z-40 border-b">
	<div class="container mx-auto flex items-center justify-between px-4 py-4">
		<a href="/home"><h1 class="text-2xl font-light tracking-wider">AstroConnect</h1></a>
		<nav class="flex space-x-4">
			<Button href="/home/search" variant="default"
				><Search /> <span class="hidden sm:inline">Search for Research</span></Button
			>
			<Button href="/home/researchers" variant="outline"
				><Users /> <span class="hidden sm:inline">Researchers</span></Button
			>
			<HeaderProfile {user} {isAdmin} />
		</nav>
	</div>
</div>
